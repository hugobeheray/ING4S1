# Lab 3 : Sockets and network programming



## II. Web Server



### 1. Skeleton

##### Q1. Explain why we are using the library `<netinet/in.h>`

`<netinet/in.h>` is one of the needed libraries of a network program with sockets. 

With this library, 2 types are defined : `in_port_t` and `in_addr_t`. It shall also define the `sa_family_t` type as described in `<sys/socket.h>`. 

Equally, the system initialize a variable (`const struct in6_addr in6addr_loopback`) to contain the loopback IPv6 address. It also defines the `IN6ADDR_LOOPBACK_INIT` macro which can be used to initialize a variable to the IPv6 loopback address.



##### Q2. Add the following line, compile and execute the server code. What is the required Linux command line and the name of the Compiler



The required Linux command is `` gcc -o execName fileName `` and the compiler name is gcc. In our case with websrv.c as a filename the command should be `` gcc -o websrv websrv.c`` . To run the executable we run ``./websrv``.



##### Q3: What would be the suitable domain in our case the domain, the type and the port number? 

The domain is ```AF_INET```, we are using IPv4 , the type is ```SOCK_STREAM```, we are using TCP, the port number is 8080. 

```c
struct addrinfo hints;                         // addrinfo structure with hints or indicator information
    memset(&hints, 0, sizeof(hints));              // We zeroed out hints using memset() first.
    hints.ai_family = AF_INET;                     // We are looking for an IPv4 address.
    hints.ai_socktype = SOCK_STREAM;               // We're going to be using TCP.
    hints.ai_flags = AI_PASSIVE;                   // We want getaddrinfo() to bind to the wildcard address. We listen on any available network interface.
    struct addrinfo *bind_address;                 // A pointer to a struct addrinfo structure, which holds the return information from getaddrinfo().
    getaddrinfo(0, "8080", &hints, &bind_address); // getaddrinfo() to fill in a structure addrinfo with the needed information. 0 is a node value and 8080 is the port number of a service
```



#####  Q4: Complete the instruction of line 37. 

```c
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
```



##### Q5: Add the source code to manage the error of the binding function

```c
if (bind(socket_listen, bind_address->ai_addr, bind_address->ai_addrlen))
    {
        fprintf(stderr, "bind() failed. (%d)\n", GETSOCKETERRNO());
        return 1;
    }
```



##### Q6: Here you should add your code to manage the error of socket listening. 

```c
if (listen(socket_listen, 10) < 0)
    {                                                                 // 10 tells listen() how many connections is allowed to queue up.
        fprintf(stderr, "listen() failed. (%d)\n", GETSOCKETERRNO()); // error when listen() return a value return 1;
    }
```





##### Q7: Now, you will surround your accept function call by an infinite while loop (a server program should never quit until it is interrupted). Add the following code to make your server program able to serve an "index.html" file through the HTTP protocol. The “index.html” could be the simple html file. 

```c
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
```



