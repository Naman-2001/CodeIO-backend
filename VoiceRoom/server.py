import socket
import threading

"""
socket.socket(): 
"""

class Server:
    def __init__(self):
        self.ip = socket.gethostbyname(socket.gethostname())
        while True:
            try:
                self.port = int(input('Port Number: '))
                self.sckt = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                self.sckt.bind((self.ip, self.port))

                break
            except:
                print("Couldn't bind to that port")
        self.connections = []
        self.accept_connections()

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
            if client != self.sckt and client != sock:
                try:
                    client.send(data)
                except:
                    pass

    def handle_client(self, conn, addr):
        while True:
            try:
                print("Connected by: ", addr)
                data = conn.recv(1024)
                self.broadcast(conn, data)

            except socket.error:
                conn.close()


server = Server()
