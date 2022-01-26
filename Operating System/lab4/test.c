#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <time.h>
#include <unistd.h>
#include <semaphore.h>

sem_t sem1, sem2, sem3;

void *process1(void *arg)
{
    sem_wait(&sem1);
    printf("process 1 beginning\n");
    sleep(1);
    sem_wait(&sem2);
    printf("process 1 end\n");
    sleep(1);
    sem_post(&sem2);
    sem_post(&sem1);
}

void *process2(void *arg)
{
    sem_wait(&sem2);
    printf("process 2 beginning\n");
    sleep(1);
    sem_wait(&sem3);
    printf("process 2 end\n");
    sleep(1);
    sem_post(&sem3);
    sem_post(&sem2);
}

void *process3(void *arg)
{
    sem_wait(&sem3);
    printf("process 3 beginning\n");
    sleep(1);
    sem_wait(&sem1);
    printf("process 3 end\n");
    sleep(1);
    sem_post(&sem1);
    sem_post(&sem3);
}

int main()
{
    sem_open(&sem1, 0, 1);
    sem_open(&sem2, 0, 1);
    sem_open(&sem3, 0, 1);
    pthread_t thread1, thread2, thread3;

    pthread_create(&thread1, NULL, &process1, NULL);
    pthread_create(&thread2, NULL, &process2, NULL);
    pthread_create(&thread3, NULL, &process3, NULL);

    pthread_join(thread1, NULL);
    pthread_join(thread2, NULL);
    pthread_join(thread3, NULL);
}