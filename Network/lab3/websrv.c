#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <sys/socket.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <unistd.h>
#include <errno.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <fcntl.h>

#define ISVALIDSOCKET(s) ((s) >= 0) // Check and return 1 if the socket is valid
#define CLOSESOCKET(s) close(s)     // Close a socket
#define SOCKET int                  // initialize the socket
#define GETSOCKETERRNO() (errno)    // Manage errors try the command "$ man errno" to learn more

int main(int argc, char **argv)
{
    printf("Configuring local address...\n");
    struct addrinfo hints;                         // addrinfo structure with hints or indicator information
    memset(&hints, 0, sizeof(hints));              // We zeroed out hints using memset() first.
    hints.ai_family = AF_INET;                     // We are looking for an IPv4 address.
    hints.ai_socktype = SOCK_STREAM;               // We're going to be using TCP.
    hints.ai_flags = AI_PASSIVE;                   // We want getaddrinfo() to bind to the wildcard address. We listen on any available network interface.
    struct addrinfo *bind_address;                 // A pointer to a struct addrinfo structure, which holds the return information from getaddrinfo().
    getaddrinfo(0, "8080", &hints, &bind_address); // getaddrinfo() to fill in a structure addrinfo with the needed information. 0 is a node value and 8080 is the port number of a service
    printf("Creating socket...\n");
    SOCKET socket_listen; // we define socket_listen as a SOCKET type. Macro defining it as int
    socket_listen = socket(bind_address->ai_family, bind_address->ai_socktype, bind_address->ai_protocol);
    // check that socket_listen is valid using the ISVALIDSOCKET() macro we defined earlier.
    if (!ISVALIDSOCKET(socket_listen))
    {
        // print an error message, GETSOCKETERRNO() macro retrieves the error number
        fprintf(stderr, "socket() failed. (%d)\n", GETSOCKETERRNO());
        return 1; // Exit the program with error message
    }
    printf("Binding socket to local address...\n");
    // we call bind() to associate the socket with our address from getaddrinfo()
    if (bind(socket_listen, bind_address->ai_addr, bind_address->ai_addrlen))
    {
        fprintf(stderr, "bind() failed. (%d)\n", GETSOCKETERRNO());
        return 1;
    }
    freeaddrinfo(bind_address); // we call the freeaddrinfo() function to release the address memory.
    // Once the socket has been created and bound to a local address, we can cause it to start listening for connections with listen()
    printf("Listening...\n");
    if (listen(socket_listen, 10) < 0)
    {                                                                 // 10 tells listen() how many connections is allowed to queue up.
        fprintf(stderr, "listen() failed. (%d)\n", GETSOCKETERRNO()); // error when listen() return a value return 1;
    }
    printf("Waiting for connection...\n");
    struct sockaddr_storage client_address;
    socklen_t client_len = sizeof(client_address);
    // We store the return value of accept() in socket_client.
    // We declare a new struct sockaddr_storage to store the address info for the connecting client. //client_len with the length of that address.
    SOCKET socket_client = accept(socket_listen, // it will block your program until a new connection is made.
                                  (struct sockaddr *)&client_address,
                                  &client_len);
    // Just check if everything is ok with accept()
    if (!ISVALIDSOCKET(socket_client))
    {
        fprintf(stderr, "accept() failed. (%d)\n", GETSOCKETERRNO());
        return 1;
    }

    int clifd;
    int file;
    char buf[BUFSIZ];
    int size;

    while (1)
    {

        SOCKET socket_client = accept(socket_listen, // it will block your program until a new connection is made.
                                      (struct sockaddr *)&client_address,
                                      &client_len);

        size = read(clifd, buf, BUFSIZ);
        write(1, buf, size);
        if ((file = open("index.html", O_RDONLY)) == -1)
            perror("open");
        size = sprintf(buf, "HTTP/1.1 200 OK \n\n");
        size += read(file, buf + size, BUFSIZ);
        write(1, buf, size);
        write(clifd, buf, size);
        close(clifd);
        close(file);
    }
    return EXIT_SUCCESS;
}
