##### Hugo BEHERAY, Zoé CROUZET

# Lab 3 : Threads

## Processes vs Threads

#### <u>With processes :</u>

```c
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <sys/types.h>
#include <sys/shm.h>
#include <sys/wait.h>

int main()
{
    int a = 5, b = 7, c = 8, d = 9, e = 4, f = 3, g = 1, h = 8;

    // create shared space
    int id = shmget(45678, 2 * sizeof(int), IPC_CREAT | 0600);
    int *tab = shmat(id, NULL, 0);

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

    int tmp = g + h;
    wait(NULL);
    printf("result = %d\n", tmp + tab[2]);
}
```

In this method, we first create 8 variables which contain the values of a, b, c, d, e, f, g and h.

Then, we create a shared space in order to store the results of every operations later. Then, we create 4 processes with `fork()` in which we do the 4 operations and in which we store the result in the shared space. We use `exit(0)` at the end of every `fork()` to report the successful completion of the program. We also use `wait(NULL)` before using the result of previous processes to be sure that the processes are done in the right order (else, the variables we use would not exist).

Finally, we print the final result.

#### <u>With threads :</u>

```C
#include <stdio.h>
#include <stdlib.h>
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

int main()
{
    pthread_t thread1, thread2, thread3, thread4;
    int *res1, *res2, *res3, *res4;

    pthread_create(&thread1, NULL, calc1, NULL);
    pthread_create(&thread2, NULL, calc2, NULL);
    pthread_create(&thread3, NULL, calc3, NULL);
    pthread_create(&thread4, NULL, calc4, NULL);

    pthread_join(thread1, (void **)&res1);
    pthread_join(thread2, (void **)&res2);
    pthread_join(thread3, (void **)&res3);
    pthread_join(thread4, (void **)&res4);

    int result = *res1 - *res2 / *res3 + *res4;
    printf("Result : %d", result);
}
```

In this method, we first declare 4 threads. We also declare 4 pointers which will contain the result of the 4 operations.

Then, we use create 4 threads with `pthread_create()`, and it starts 4 methods : `calc1()`, `calc2()`, `calc3()` and `cacl4()`. In these methods, we do the operations, then we put the result in a variable and we use `malloc` to allocate the result. After that, we use the `pthread_exit` method to be able to get the variables in the `main()`.

Finally, in the `main`, we get variables we `pthread_join()` method, we do the operation and we display it.

#### <u>Performance of both solutions using the `times` function</u> :

In order to measure the performance of both solutions, we use the “times” function, which returns the number of clock ticks.

To implement it, we add `clock_t times(struct tms *buf);` before the `main()`. Then, we define start and end, which are struct tms variables. Then, we add`times(&start);` at the beginning of the `main()` to get the departure time. After, we put the operations in a for loop (looping 10000 times) so that the time is big enough to be measured. Finally, we add `times(&end);`  at the end of the `main()` to get the arrival time  and we display the final time with `printf("%lf usec\n", (end.tms_utime+end.tms_stime-start.tms_utime-start.tms_stime) * 1000000.0 / sysconf(_SC_CLK_TCK));`

This is the code for the processes :

```c
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
    struct tms start, end;

    times(&start);

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

    times(&end);

    printf("%lf usec\n", (end.tms_utime + end.tms_stime - start.tms_utime - start.tms_stime) * 1000000.0 / sysconf(_SC_CLK_TCK));
}
```

With the processes solution, **the performance is 260 000 usec**.

This is the code for the threads :

```c
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
    struct tms start, end;
    times(&start);

    pthread_t thread1, thread2, thread3, thread4;
    int *res1, *res2, *res3, *res4;

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

    times(&end);

    printf("%lf usec\n", (end.tms_utime + end.tms_stime - start.tms_utime - start.tms_stime) * 1000000.0 / sysconf(_SC_CLK_TCK));
}
```

With the threads solution, **the performance is 106 000 usec**.

We can notice with the time function that the **threads are faster** (around 2.5 times faster).



#### <u>Number of I/O and context switches using the `getrusage` function</u> :

In order to display the number of I/O and context switches, we use the "getrusage" function, which provides measures of the resources used by the current process.

In order to get the number of I/O and context switches, we first define rstart and rend, which are struct rusage functions. Then, we use `getrusage(RUSAGE_SELF, &rend)` to return resource usage statistics for the calling process  (sum of resources used by all threads in the process). Finally, we display the results with `rend.ru_nivcsw`, `rend.ru_nvcsw`, `rend.ru_inblock` and `rend.ru_oublock`. 

This is the code for the processes :

```c
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
    printf("voluntary context switch : %ld", rend.ru_nvcsw);
    printf("input : %ld", rend.ru_inblock);
    printf("output : %ld", rend.ru_oublock);
}
```

```
➜ ./lab3
result = -51
involuntary context switch : 2342
voluntary context switch : 0
input : 0
output : 0
```



This is the code for the threads :

```c
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
    printf("voluntary context switch : %ld", rend.ru_nvcsw);
    printf("input : %ld", rend.ru_inblock);
    printf("output : %ld", rend.ru_oublock);
}
```

```
➜ ./lab3
Result :-51
involuntary context switch : 42233
voluntary context switch : 0
input : 0
output : 0
```

We can notice that both have 0 I/O. It can be explained by the fact that we don't use any file system. About the context switches, we have 0 voluntary context switch for both but 42 233 for threads and 2342 for processes. 

The voluntary context switch is 0 for both because any data has to be stored for later. 

The involuntary context switches occurs when the system scheduler suspends an active thread, and switches control to a different thread. This is why it is bigger for the threads method.



#### <u>Differences between the process and the thread versions</u> :

A process is a program under execution whereas **a thread is a lightweight process** that can be managed independently by a scheduler. These are the main differences :

- Processes are totally independent and don’t share memory whereas a thread **may share some memory** with its peer threads.
- Processes **require more time** that threads for context switching, for creation and for termination, as we saw with `time()` function.
- Processes **require more resources** than threads, ad we saw with `getrusage()` function.

We can infer that threads are more adapted in our case because it is faster and it requires less resources. It is also able to share some memory, which is easier to do the operation in different processes. With the processes method, we have to store our data in a shared space, which can explain why the program is **heavier and slower**. However, threads method do more involuntary context switches.

