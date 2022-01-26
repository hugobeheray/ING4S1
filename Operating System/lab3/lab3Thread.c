#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <sys/types.h>
#include <sys/shm.h>
#include <sys/wait.h>
#include <sys/times.h>
#include <pthread.h>

void *calc1(void *arg)
{
    int a = 5, b = 7;
    int *res1 = malloc(sizeof(int));
    *res1 = a + b;
    pthread_exit(res1);
}

void *calc2(void *arg)
{

    int c = 8, d = 9;
    int *res2 = malloc(sizeof(int));
    *res2 = c * d;
    pthread_exit(res2);
}

void *calc3(void *arg)
{
    int e = 4, f = 3;
    int *res3 = malloc(sizeof(int));
    *res3 = e - f;
    pthread_exit(res3);
}

void *calc4(void *arg)
{
    int g = 1, h = 8;
    int *res4 = malloc(sizeof(int));
    *res4 = g + h;
    pthread_exit(res4);
}

clock_t times(struct tms *buf);

int main()
{
    struct rusage rstart, rend;

    pthread_t thread1, thread2, thread3, thread4;
    int *res1, *res2, *res3, *res4;

    getrusage(RUSAGE_SELF, &rstart);

    for (int i = 0; i < 10000; i++)
    {
        pthread_create(&thread1, NULL, calc1, NULL);
        pthread_create(&thread2, NULL, calc2, NULL);
        pthread_create(&thread3, NULL, calc3, NULL);
        pthread_create(&thread4, NULL, calc4, NULL);

        pthread_join(thread1, (void **)&res1);
        pthread_join(thread2, (void **)&res2);
        pthread_join(thread3, (void **)&res3);
        pthread_join(thread4, (void **)&res4);
    }

    int result = *res1 - *res2 / *res3 + *res4;

    printf("Result :%d\n", result);

    getrusage(RUSAGE_SELF, &rend);

    printf("involuntary context switch : %ld\n", rend.ru_nivcsw);
    printf("voluntary context switch : %ld\n", rend.ru_nvcsw);
    printf("input : %ld\n", rend.ru_inblock);
    printf("output : %ld\n", rend.ru_oublock);
}