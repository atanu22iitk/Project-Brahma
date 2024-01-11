import socket
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.backends import default_backend
from cryptography.fernet import Fernet

def encrypt_document(document, key):
    cipher = Fernet(key)
    encrypted_document = cipher.encrypt(document)
    return encrypted_document

def save_to_file(data, output_path):
    with open(output_path, 'wb') as output_file:
        output_file.write(data)

def load_from_file(input_path):
    with open(input_path, 'rb') as input_file:
        return input_file.read()

# Prompt user for the path to the document
document_path = input("Enter the path to the document: ")

# Read the document content
with open(document_path, 'rb') as file:
    document_content = file.read()

# Generate a key for encryption
key = Fernet.generate_key()

# Encrypt the document using the generated key
encrypted_document = encrypt_document(document_content, key)

# Establish a connection and wait for the client to connect
HOST = '172.29.208.93'
PORT = 12345

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_socket:
    server_socket.bind((HOST, PORT))
    server_socket.listen()

    print(f"Server is listening on {HOST}:{PORT}")

    client_socket, client_address = server_socket.accept()
    with client_socket:
        print(f"Connection established from {client_address}")

        # Request the client's public key
        client_public_key_bytes = client_socket.recv(2048)
        client_public_key = serialization.load_pem_public_key(
            client_public_key_bytes,
            backend=default_backend()
        )

        # Encrypt the symmetric key with the client's public key
        encrypted_key = client_public_key.encrypt(
            key,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        # Save the encrypted key to a file
        save_to_file(key, 'key.txt')

        # Save the encrypted key to a file
        save_to_file(encrypted_key, 'encrypted_key.bin')

        # Send the encrypted key to the client
        client_socket.sendall(encrypted_key)

        print("Encrypted key sent to the client.")
