import socket
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.backends import default_backend
from cryptography.fernet import Fernet
#function to decrypt the key
def decrypt_key(encrypted_key, private_key_client):
    decrypted_key = private_key_client.decrypt(
        encrypted_key,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return decrypted_key

def save_to_file(data, output_path):
    with open(output_path, 'wb') as output_file:
        output_file.write(data)
# Prompt user for the path to the private key
private_key_path = input("Enter the path to your private key file: ")
with open(private_key_path, 'rb') as private_key_file:
    private_key_client = serialization.load_pem_private_key(
        private_key_file.read(),
        password=None,
        backend=default_backend()
    )

# Get the public key from the private key
public_key_client = private_key_client.public_key()

# Establish a connection to the server
HOST = input("Enter the server's hostname or IP address: ")
PORT = 12345

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client_socket:
    client_socket.connect((HOST, PORT))

    # Send the public key to the server
    public_key_bytes = public_key_client.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    client_socket.sendall(public_key_bytes)

    # Receive the encrypted key from the server
    encrypted_key = client_socket.recv(2048)

    # Decrypt the key using the client's private key
    decrypted_key = decrypt_key(encrypted_key, private_key_client)

    print("Public key sent and encrypted key received and decrypted.")

    # Now you can use the decrypted key to decrypt the document or perform other cryptographic operations.
    # Save the encrypted key to a file
    save_to_file(decrypted_key, 'decrypted_key.txt')