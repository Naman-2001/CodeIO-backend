import socket
import threading

"""
socket.socket(): 
"""

class Server:
    def __init__(self):
        self.ip = socket.gethostbyname(socket.gethostname())  # Get the address(IP)
        self.port = int(input('Port Number: '))  # Port forwarding port number
        self.sckt = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sckt.bind((self.ip, self.port))
        self.connections = []
        try:
            self.accept_connections()
        except:
            print("Could not bind")

    def accept_connections(self):
        self.sckt.listen()
        print('Running on IP: ' + self.ip)
        print('Running on port: ' + str(self.port))
        while True:
            conn, addr = self.sckt.accept()
            self.connections.append(conn)
            threading.Thread(target=self.handle_client, args=(conn, addr,)).start()

    def broadcast(self, sock, data):
        for client in self.connections:
            client.sendall(data)

    def handle_client(self, conn, addr):
        try:
            print("Connected by: ", addr)
            while True:
                data = conn.recv(1024)
                self.broadcast(conn, data)
        except socket.error:
                conn.close()


server = Server()
