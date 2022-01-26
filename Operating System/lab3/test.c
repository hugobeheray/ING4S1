<<<<<<< HEAD
int main()
{
    printf("la");
=======
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>

void *f1(void *arg)
{
    int *a = malloc(sizeof(int));
    *a = 5;
    pthread_exit(a);
}

int main()
{
    pthread_t thread1;
    int *ptr;

    pthread_create(&thread1, NULL, f1, NULL);

    pthread_join(thread1, (void **)&ptr);

    printf("ptr = %p val = %d\n", ptr, *ptr);
>>>>>>> main
}