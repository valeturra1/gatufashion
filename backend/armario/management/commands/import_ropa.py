import re
from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from armario.models import Ropa, ParteRopa


CATEGORIA_MAP = {
    'camisas': 'camisa',
    'pantalones': 'pantalon',
    'zapatos': 'zapatos',
    'cabellos': 'cabello',
    'cara': 'cara',
    'accesorios': 'accesorios',
}

IMG_EXT = {'.png', '.jpg', '.jpeg', '.webp', '.gif'}

TIPOS = '|'.join(t for t, _ in ParteRopa.TIPO_OPCIONES)  # preview|torso|manga|puesto
FULL_RE = re.compile(rf'^item_(?P<id>\d+)_(?P<orden>\d+)(?P<tipo>{TIPOS})$', re.IGNORECASE)
SHORT_RE = re.compile(rf'^item_(?P<orden>\d+)(?P<tipo>{TIPOS})$', re.IGNORECASE)


class Command(BaseCommand):
    help = "Importa las imágenes de la carpeta ropa/ (estructura genero/categoria[/subcategoria]/item_ID_ORDENtipo.ext)"

    def add_arguments(self, parser):
        parser.add_argument('ruta', type=str, help='Ruta a la carpeta ropa/')

    def handle(self, *args, **options):
        base = Path(options['ruta'])
        self.sin_id = []  # archivos que no se pudieron agrupar por id

        for genero_dir in sorted(base.iterdir()):
            if not genero_dir.is_dir():
                continue
            genero = genero_dir.name.lower()
            if genero not in ('hombre', 'mujer', 'unisex'):
                self.stdout.write(self.style.WARNING(f"Carpeta de género desconocida, se ignora: {genero_dir}"))
                continue

            for categoria_dir in sorted(genero_dir.iterdir()):
                if not categoria_dir.is_dir():
                    continue
                categoria = CATEGORIA_MAP.get(categoria_dir.name.lower())
                if not categoria:
                    self.stdout.write(self.style.WARNING(f"Carpeta de categoría desconocida, se ignora: {categoria_dir}"))
                    continue

                self._procesar_categoria(categoria_dir, genero, categoria, subcategoria=None)

        if self.sin_id:
            self.stdout.write(self.style.ERROR(f"\n{len(self.sin_id)} archivos sin ID, no se importaron (revísalos a mano):"))
            for f in self.sin_id:
                self.stdout.write(f"  - {f}")

        self.stdout.write(self.style.SUCCESS("\nImportación terminada."))

    def _procesar_categoria(self, dir_path, genero, categoria, subcategoria):
        """Procesa imágenes sueltas en dir_path, y recurre en subcarpetas (como
        accesorios/cuello|gafas|gorros o cara/pestañas), que se guardan como subcategoria."""
        archivos = [f for f in dir_path.iterdir() if f.is_file() and f.suffix.lower() in IMG_EXT]
        if archivos:
            self._agrupar_e_importar(archivos, genero, categoria, subcategoria)

        for sub in sorted(dir_path.iterdir()):
            if sub.is_dir():
                self._procesar_categoria(sub, genero, categoria, sub.name.lower())

    def _agrupar_e_importar(self, archivos, genero, categoria, subcategoria):
        grupos = {}  # item_id -> {tipo: path}

        for f in archivos:
            m = FULL_RE.match(f.stem)
            item_id = None
            tipo = None
            if m:
                item_id = m.group('id')
                tipo = m.group('tipo').lower()
            else:
                m2 = SHORT_RE.match(f.stem)
                if m2:
                    # sin id explícito: no podemos agruparlo con confianza
                    self.sin_id.append(f)
                    continue
                else:
                    self.stdout.write(self.style.WARNING(f"Nombre no reconocido, se ignora: {f}"))
                    continue

            grupos.setdefault(item_id, {})[tipo] = f

        for item_id, partes in grupos.items():
            self._crear_item(genero, categoria, subcategoria, item_id, partes)

    def _crear_item(self, genero, categoria, subcategoria, item_id, partes):
        etiqueta = f"{genero}-{categoria}-{subcategoria or 'x'}-{item_id}"
        slug = slugify(etiqueta)

        ropa, creado = Ropa.objects.get_or_create(
            slug=slug,
            defaults={'categoria': categoria, 'genero': genero, 'subcategoria': subcategoria},
        )
        if not creado:
            self.stdout.write(f"Ropa '{slug}' ya existía, se reutiliza")

        for tipo, img_path in partes.items():
            if ropa.partes_ropa.filter(tipo=tipo).exists():
                self.stdout.write(f"  {slug} -> {tipo} ya existe, se omite")
                continue

            with open(img_path, 'rb') as f:
                parte = ParteRopa(ropa=ropa, tipo=tipo)
                parte.imagen.save(img_path.name, File(f), save=True)

            self.stdout.write(self.style.SUCCESS(f"  {slug} -> {tipo} ({img_path.name})"))