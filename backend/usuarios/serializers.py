from rest_framework import serializers
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from .models import Usuario


class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        usuario = Usuario.objects.create_user(**validated_data)
        return usuario

class RecuperarPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("No existe una cuenta con ese correo")
        return value

    def save(self):
        email = self.validated_data['email']
        usuario = Usuario.objects.get(email=email)

        token = default_token_generator.make_token(usuario)
        uid = urlsafe_base64_encode(force_bytes(usuario.pk)) # urlsafe_base64_encode exige bytes para poder codificar, por eso usamos force_bytes para que el id obtenido de usuario.pk lo convierta a bytes

        link = f"http://localhost:5173/cambiar-password/{uid}/{token}/"

        mensaje_html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background-color: #FFF9E6; border-radius: 16px;">
        <h1 style="color: #F97316; text-align: center;">GatuFashion</h1>
        <p style="color: #333; font-size: 16px;">
            Hola <strong>{usuario.username}</strong>,
        </p>
        <p style="color: #333; font-size: 16px;">
            Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva:
        </p>
        <div style="text-align: center; margin: 24px 0;">
            <a href="{link}" style="background-color: #F97316; color: white; padding: 12px 32px; border-radius: 999px; text-decoration: none; font-weight: bold; display: inline-block;">
            Restablecer contraseña
            </a>
        </div>
        <p style="color: #999; font-size: 13px; text-align: center;">
            Si no solicitaste esto, puedes ignorar este correo.
        </p>
        </div>
        """

        send_mail(
            subject="Recupera tu contraseña de GatuFashion",
            message=f"Hola {usuario.username}, usa este link para crear una nueva contraseña: {link}",
            from_email="GatuFashion <gatufashion.mg@gmail.com>",
            recipient_list=[usuario.email],
            html_message=mensaje_html,
        )

class CambiarPasswordSerializer(serializers.Serializer):
    # aca definimos todos los datos quue va a recibir esta clase, recibimos la contraseña, el token y el uid (id usuario)
    password = serializers.CharField(write_only=True, min_length=6)
    token = serializers.CharField(write_only=True)
    uid = serializers.CharField()

    # usamos el validate_campo cuando la validacion depende de un solo campo,
    # y el validate cuando la validacion depende de varios campos,
    # en este caso depende del token y del uid, asi que tenemos una especie de diccionario
    def validate(self, data):
        uid = force_str(urlsafe_base64_decode(data['uid'])) # urlsafe_base64_decode devuelve bytes, por eso usamos force_str para que lo convierta a string

        # probamos si existe el usuario y si el token es valido, si este no existe mandamos un error
        try:
            usuario = Usuario.objects.get(pk=uid)
        except Usuario.DoesNotExist:
            raise serializers.ValidationError("Token inválido")

        token = default_token_generator.check_token(usuario, data['token']) # asi accedemos a los datos del diccionario

        if not token:
            raise serializers.ValidationError("Token inválido")

        self.usuario = usuario # guardamos el usuario en self.usuario para poder usarlo en el metodo save()

        return data

    def save(self):
        # aca practicamente lo que hacemos es que la contraseña que ya paso por validate
        # (luego de ser llamada en la vista por is_valid()) la guardamos en una variable
        password = self.validated_data['password'] 

        self.usuario.set_password(password) # seteamos la nueva contraseña, usamos set_password porque encripta la contraseña antes de guardarla en la base de datos
        self.usuario.save() # guardamos cambios
