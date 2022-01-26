#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <sys/types.h>
#include <sys/shm.h>
#include <sys/wait.h>
#define KEY1 4567
#define KEY2 4568
#define KEY3 4569
#define KEY4 4570

#define PERMS 0660

int main(int argc, char **argv)
{
    int id1, id2, id3, id4;
    int *res1, *res2, *res3, *isFinished;

    id1 = shmget(KEY1, sizeof(int), IPC_CREAT | PERMS); //creates and stores the identifier of the shared memory in the variable id
    id2 = shmget(KEY2, sizeof(int), IPC_CREAT | PERMS); //creates and stores the identifier of the shared memory in the variable id
    id3 = shmget(KEY3, sizeof(int), IPC_CREAT | PERMS); //creates and stores the identifier of the shared memory in the variable id
    id4 = shmget(KEY4, sizeof(int), IPC_CREAT | PERMS); //creates and stores the identifier of the shared memory in the variable id

    res1 = (int *)shmat(id1, NULL, 0);
    res2 = (int *)shmat(id2, NULL, 0);
    res3 = (int *)shmat(id3, NULL, 0);
    isFinished = (int *)shmat(id4, NULL, 0);

    *isFinished = 0;

    if (fork() == 0)
    {

        while (*isFinished != 1)
        {
            // Process 2
            int c = 5;
            int d = 4;
            *res2 = c - d;
            sleep(3);
            *isFinished = 2;
        }
    }
    else
    {
        if (fork() == 0)
        {
            while (*isFinished != 2)
            {
                // Process 3
                int e = 6;
                int f = 7;
                *res3 = e + f;
                int finalRes = *res1 * *res2 + *res3;
                sleep(3);
                printf("%d", finalRes);
                *isFinished = 2;
            }
        }
        else
        {
            // Process 1
            int a = 2;
            int b = 3;
            *res1 = a + b;
            sleep(3);
            *isFinished = 1;
        }
    }
}