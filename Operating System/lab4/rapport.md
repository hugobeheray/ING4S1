#### BEHERAY Hugo, CROUZET Zoé

# Lab 4 : Interprocess Synchronization



### Concurrent Access To Shared Memory : Race Problems

#### 1.

```c
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>

int i = 65;

void *increase(void *arg)
{
    sleep(1);
    i++;
}

void *decrease(void *arg)
{
    i--;
    sleep(1);
}

int main()
{
    pthread_t thread1, thread2;
    for (int j = 0; j < 20; j++)
    {
        pthread_create(&thread1, NULL, increase, NULL);
        pthread_create(&thread2, NULL, decrease, NULL);

        printf("%d\n", i);
    }
}
```

#### Output :

```c
65
65
65
65
64
64
64
64
65
65
65
64
65
65
64
64
64
64
63
```

In order to implement two tasks, we use 2 threads. We first create 2 variable (type pthread_t). We also create a global variable named i, initialized to 65.

Then, we create 2 methods : one to increase and the other one to decrease i. We also use a `sleep()` to be sure that there is a context switch.

In the main process, we use `pthread_create()` to call the methods and we print i. We put it in a for loop to do it 20 t in order to have more result.

The **output is not always the same**. It variates between 62 and 67. 



#### 2.

It would lead to an error because both operations (Reg++ and Reg--) are **done at the same time**.  In fact, the Reg++ or Reg-- instructions are in reality **3 instructions**. When both are done at the same time, it may happen that they are **switched**, so the output is wrong (because some results are overwritten during the execution). That is why we often have wrong results. To obtain the value we expect, we should synchronize the operations using semaphores.



### Solving the Problem : Synchronizing access using semaphores



#### 1.

To enforce mutual exclusion and solve the race problem, **we use semaphores.**

First, we create a semaphore and we add `sem_open(&semaphore,0,1)` to initialize and open the semaphore. Then, we use `sem_wait(&semaphore)` and `sem_post(&semaphore)` in each thread to be sure that there is no context switch.

In effective, the first thread which is executed use `sem_wait()` which decrease the semaphore's value so that the other thread can't begin. When the operation is finished, we use `sem_post()` to increase the semaphore's value so the other thread can do its operation.

```c
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <time.h>
#include <unistd.h>
#include <semaphore.h>

int i;
sem_t semaphore;

void *increase(void *arg)
{
    sem_wait(&semaphore);
    sleep(1);
    i++;
    sem_post(&semaphore);
}

void *decrease(void *arg)
{
    sem_wait(&semaphore);
    i--;
    sleep(1);
    sem_post(&semaphore);
}

int main()
{
    for (int j = 0; j < 20; j++)
    {
        i = 65;
        sem_open(&semaphore, 0, 1);
        pthread_t thread1, thread2;

        pthread_create(&thread1, NULL, &increase, NULL);
        pthread_create(&thread2, NULL, &decrease, NULL);

        pthread_join(thread1, NULL);
        pthread_join(thread2, NULL);

        printf("%d\n", i);
    }
}
```

#### Output :

```c
65
65
65
65
65
65
65
65
65
65
65
65
65
65
65
65
65
65
65
```



#### a.

To experiment the situation with more than 2 processes, we create 3 threads which will each call the increase method. We call 3 times `increase()` so the expected output is 68.

````c
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <time.h>
#include <unistd.h>
#include <semaphore.h>

int i;
sem_t semaphore;

void *increase(void *arg)
{
    sem_wait(&semaphore);
    sleep(1);
    i++;
    sem_post(&semaphore);
}

int main()
{
    for (int j = 0; j < 20; j++)
    {
        i = 65;
        sem_init(&semaphore, 0, 1);
        pthread_t thread1, thread2, thread3;

        pthread_create(&thread1, NULL, &increase, NULL);
        pthread_create(&thread2, NULL, &increase, NULL);
        pthread_create(&thread3, NULL, &increase, NULL);

        pthread_join(thread1, NULL);
        pthread_join(thread2, NULL);
        pthread_join(thread3, NULL);

        printf("%d\n", i);
    }
}
````

**Output :**

```c
68
68
68
68
68
68
68
68
68
68
68
68
68
68
68
68
68
68
68
68
```

As we can see, it works the same for more than 2 processes. There is no order in which thread are called but all of them are called without context switch. In effective, the first thread which is executed use `sem_wait()` which decrease the semaphore's value so that other threads can't begin. When the operation is finished, we use `sem_post()` to increase the semaphore's value so that another thread can repeat the operation. The operation is repeated as much time as there are threads.

There is nothing more to do to enforce mutual exclusion.



#### 2.

```c
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
  	printf("process 1 lock\n");
  	sleep(1);
    sem_wait(&sem2);
    printf("process 1 done\n");
    sleep(1);
    sem_post(&sem2);
    sem_post(&sem1);
}

void *process2(void *arg)
{
    sem_wait(&sem2);
  	printf("process 2 lock\n");
  	sleep(1);
    sem_wait(&sem3);
    printf("process 2 done\n");
    sleep(1);
    sem_post(&sem3);
    sem_post(&sem2);
}

void *process3(void *arg)
{
    sem_wait(&sem3);
  	printf("process 3 lock\n");
  	sleep(1);
    sem_wait(&sem1);
    printf("process 3 done\n");
    sleep(1);
    sem_post(&sem1);
    sem_post(&sem3);
}

int main()
{
    sem_init(&sem1, 0, 1);
    sem_init(&sem2, 0, 1);
    sem_init(&sem3, 0, 1);
    pthread_t thread1, thread2, thread3;

    pthread_create(&thread1, NULL, &process1, NULL);
    pthread_create(&thread2, NULL, &process2, NULL);
    pthread_create(&thread3, NULL, &process3, NULL);

    pthread_join(thread1, NULL);
    pthread_join(thread2, NULL);
    pthread_join(thread3, NULL);
}
```

#### Output :

```c
process 3 lock
process 2 lock
process 1 lock
```

In order to force a deadlock situation using three processes, we create 3 semaphores. The 3 processes can begin and read their first line. However, thread1 will wait for sem2 to be post to continue, thread 2 will wait for sem3 to be post to continue and thread 3 will wait for sem1 to be post to continue. This will create an infinite loop of blocked processes, a deadlock. This is why the process 1, 2, 3 "done" print is never displayed.



#### 3.

```c
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

void *runThread1(void *arg);
void *runThread2(void *arg);
void *runThread3(void *arg);

sem_t sem1, sem2;


void *thread1(void *arg)
{
    sem_wait(&sem1);
    system("node"); //firefox was not working
    sem_post(&sem1);
}

void *thread2(void *arg)
{
    sem_wait(&sem1);
    system("emacs");
    sem_post(&sem2);
    sem_post(&sem1);
}

void *thread3(void *arg)
{
    sem_wait(&sem2);
    system("vi");
    sem_post(&sem2);
}

int main(int argc, char *argv[])
{
    sem_init(&sem1, 0, 1);
    sem_init(&sem2, 0, 0);
    pthread_t t1, t2, t3;

    pthread_create(&t1, NULL, &thread1, NULL);
    pthread_create(&t2, NULL, &thread2, NULL);
    pthread_create(&t3, NULL, &thread3, NULL);

    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    pthread_join(t3, NULL);

    return 0;
}
```

To run 3 different applications, we create 2 semaphore. We initialize sem2 to 0 so that thread3 is launched last.

First, node is launched (firefox was not working) and sem1 increase with `wait` and then decrease with `post`. Then, emacs is launched once node's process is finished. We increase sem2's value so that thread 3 can begin (because it was initially 0). Finally, vi is launched because sem2's value is 1.

#### 4.

```c
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

struct numbers {
  int nb1;
  int nb2;
};

sem_t sem1;
sem_t sem2;
int result[3];
int index = 0;
int res = 1;

void *add(void *arg) {
    if(index!=2){
        struct numbers *args = (struct numbers *) arg;
        sem_wait(&sem1);
        result[index] = args->nb1 + args->nb2;
        index++;
        sem_post(&sem1);
    }
    else{
        struct numbers *args = (struct numbers *) arg;
        sem_wait(&sem1);
        sem_wait(&sem2);
        result[index] = args->nb1 + args->nb2;
        index++;
        sem_post(&sem2);
        sem_post(&sem1);
    }
}

void *multiply(void *arg) {
    if(index!=2){
        sem_wait(&sem1);
        res *= result[index];
        index++;
        sem_post(&sem1);
    }
    else{
        sem_wait(&sem1);
        sem_wait(&sem2);
        res *= result[index];
        index++;
        sem_post(&sem2);
        sem_post(&sem1);
    }
}

int main(int argc, char* argv[])
{
  int i;
  pthread_t t1, t2, t3, t4;

  sem_init(&sem1, 0, 1);
  sem_init(&sem2, 0, 1);

  int a = 1, b = 2, c = 2, d = 4, e = 2, f = 3;
  struct numbers nbT1, nbT2, nbT3;
  nbT1.nb1 = a;
  nbT1.nb2 = b;  
  nbT2.nb1 = c;
  nbT2.nb2 = d;
  nbT3.nb1 = e;
  nbT3.nb2 = f;
  
  pthread_create(&t1, NULL, &add, (void *) &nbT1);
  pthread_create(&t2, NULL, &add, (void *) &nbT2);
  pthread_create(&t3, NULL, &add, (void *) &nbT3);

  pthread_join(t1, NULL);
  pthread_join(t2, NULL);
  pthread_join(t3, NULL);

  index = 0;

  for (i = 0; i < 3; i++) {
    pthread_create(&t4, NULL, &multiply, (void *) NULL);
    pthread_join(t4, NULL);
  }
  
  printf("Result : %d\n", res);

  return 0;
}
```

In order to implement the parallelized calculation, we create 2 methods :

* One to add, that we use 3 times for the additions
* One to multiply, that we use 3 times for the multiplications

Both methods are divided in two parts : 

* In the addition method, the first part uses 1 semaphore so that the multiplication is done when the first 2 additions are done
* In the additions method, the second part uses 2 semaphores so that the last multiplication is only done when all the additions are done.

