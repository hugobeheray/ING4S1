#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
int main(int argc, char *argv[])
{
    printf("%s\n",  argv[0]);
    printf("new process id = %d\n", getpid());
    return 0;
}