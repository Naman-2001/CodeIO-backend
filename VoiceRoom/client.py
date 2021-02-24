import socket
import threading
import pyaudio

"""

"""


class Client:
    def __init__(self):
        self.sckt = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        while True:
            try:
                self.target_ip = input('Server IP: ')
                self.target_port = int(input('Port: '))
                self.sckt.connect((self.target_ip, self.target_port))
                break
            except:
                print("Couldn't connect to server")

        chunk_size = 1024  # 512
        audio_format = pyaudio.paInt16
        channels = 1
        rate = 20000
        # initialise microphone recording
        self.p = pyaudio.PyAudio()
        self.playing_stream = self.p.open(format=audio_format, channels=channels, rate=rate, output=True,
                                          frames_per_buffer=chunk_size)
        self.recording_stream = self.p.open(format=audio_format, channels=channels, rate=rate, input=True,
                                            frames_per_buffer=chunk_size)
        print("Connected to Server")
        # start threads
        receive_thread = threading.Thread(target=self.receive_server_data).start()
        self.send_data_to_server()

    def receive_server_data(self):
        while True:
            try:
                data = self.sckt.recv(1024)
                self.playing_stream.write(data)
            except:
                pass

    def send_data_to_server(self):
        while True:
            try:
                data = self.recording_stream.read(1024)
                self.sckt.sendall(data)
            except:
                pass


client = Client()
