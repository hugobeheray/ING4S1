#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

int i = 65;
sem_t semaphore;

void *increase(void *arg)
{
    sem_wait(&semaphore);
    int *Reg = malloc(sizeof(int));
    *Reg = i;
    *Reg++;
    sleep(1);
    sem_post(&semaphore);
    pthread_exit(Reg);
}

void *decrease(void *arg)
{
    sem_wait(&semaphore);
    int *Reg = malloc(sizeof(int));
    *Reg = i;
    *Reg--;
    sleep(1);
    sem_post(&semaphore);
    pthread_exit(Reg);
}

int main()
{
    // for (int j = 0; j < 20; j++)
    // {
    sem_open(&semaphore, 0, 1);
    int *Reg = i;

    pthread_t thread1, thread2;
    pthread_create(&thread1, NULL, increase, NULL);
    pthread_create(&thread2, NULL, decrease, NULL);

    pthread_join(thread1, (void **)&Reg);
    pthread_join(thread2, (void **)&Reg);

    i = *Reg;

    printf("%d\n", i);
    // }
}