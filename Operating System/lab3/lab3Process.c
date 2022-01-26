#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <sys/types.h>
#include <sys/shm.h>
#include <sys/wait.h>
#include <sys/times.h>

clock_t times(struct tms *buf);

int main()
{
    struct rusage rstart, rend;
    int a = 5, b = 7, c = 8, d = 9, e = 4, f = 3, g = 1, h = 8;

    // create shared space
    int id = shmget(45678, 2 * sizeof(int), IPC_CREAT | 0600);
    int *tab = shmat(id, NULL, 0);

    for (int i = 0; i < 10000; i++)
    {
        if (fork() == 0)
        {
            if (fork() == 0)
            {
                tab[0] = c * d;
                exit(0);
            }

            if (fork() == 0)
            {

                int tmp = e - f;
                wait(NULL);
                tab[1] = tab[0] / tmp;
                exit(0);
            }

            int tmp = a + b;
            wait(NULL);
            tab[2] = tmp - tab[1];
            exit(0);
        }
    }

    int tmp = g + h;
    wait(NULL);

    printf("result = %d\n", tmp + tab[2]);

    getrusage(RUSAGE_SELF, &rend);

    printf("involuntary context switch : %ld\n", rend.ru_nivcsw);
    printf("voluntary context switch : %ld\n", rend.ru_nvcsw);
    printf("input : %ld\n", rend.ru_inblock);
    printf("output : %ld\n", rend.ru_oublock);
}