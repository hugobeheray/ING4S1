// #include <stdio.h>
// #include <sys/types.h>
// #include <unistd.h>
// int main() {
// //     int id = fork();
// //     printf("id value : %d\n",id);
// //   if(id == 0)
// //   {
// //       printf("for the child :\n");
// //       printf("I'm the child\n");
// //       printf("child pid is %d\n",getpid());
// //       printf("parent pid is %d\n",getppid());
// //   }
// //   else
// //   {
// //       printf("for the parent :\n");
// //       printf("I'm the parent\n");
// //       printf("child pid is %d\n",id);
// //       printf("parent pid is %d\n",getpid());
// //   }

// // int i = 5;
// // if (fork() == 0) {
// //   // I’m the ...
// //   i++;
// // } else {
// //   // I’m the  ...
// //   sleep(3); // sleep for 3 seconds
// //   printf("%d\n", i); // what happens here ?? Explain
// // }

// // int pid2;
// //   int pid1;
// //   int pid3;
// //   pid2 = fork();
// //   if(pid2 == 0){
// //     printf("Child Process B:\npid :%d\nppid:%d\n",getpid(),getppid());
// //     pid3 = fork();
// //         if(pid3 == 0)
// //         {
// //             printf("Child Process C:\npid :%d\nppid:%d\n",getpid(),getppid());
// //         }
// //         else
// //         {
// //             sleep(3);
// //             printf("\nParent Process 2nd level:\npid:%d\nppid :%d\n",getpid(),getppid());
// //         }
// //   }
// //   if(pid2 > 0){
// //     pid1 = fork();
// //     if(pid1 > 0){
// //       printf("\nParent Process:\npid:%d\nppid :%d\n",getpid(),getppid());
// //     }
// //     else if(pid1 == 0){
// //         sleep(3);
// //       printf("Child Process A:\npid :%d\nppid:%d\n",getpid(),getppid());
// //     }
// //   }

// // int pid2;
// // int pid1;
// // int pid3;
// // pid2 = fork();
// // if(pid2 == 0)
// // {
// //     pid3 = fork();
// //     if(pid3 == 0)
// //     {
// //         printf("2nd level:\npid :%d\nppid:%d\n",getpid(),getppid());
// //     }
// //     else
// //     {
// //         sleep(3);
// //         printf("\n1st level child 1:\npid:%d\nppid :%d\n",getpid(),getppid());
// //     }
// // }
// // else
// // {
// //     sleep(3);
// //     pid1 = fork();
// //     if(pid1 > 0)
// //     {
// //         sleep(3);
// //         printf("\nMain:\npid:%d\nppid :%d\n",getpid(),getppid());
// //     }
// //     else if(pid1 == 0)
// //     {
// //     printf("\n1st level child 2:\npid :%d\nppid:%d\n",getpid(),getppid());
// //     }
// // }

// //    int c1,c2,c3;

// // (c1 = fork()) && (c2 = fork()); // Creates two children for the 1st level process

// // if (c1 == 0) {
// //     c3 = fork();
// //     printf("c1 ppid is %d\n",getppid());
// //     printf("c1 pid is %d\n",getpid());
// //     if(c3 ==0){
// //         printf("c3 ppid is %d\n",getppid());
// //     printf("c3 pid is %d\n",getpid());
// //     }
// //     else
// //     {
// //         sleep(3); 
// //     }
// // } else if (c2== 0) {
// //     printf("c2 ppid is %d\n",getppid());
// //     printf("c2 pid is %d\n",getpid());
// // } else {
// //     sleep(3); 
// //     /* Parent code goes here */
// // }

// printf("PID of original file : %d\n",getpid());
// char *args[]={"Hello","C","Programming",NULL};
// execv("./hello.c",args);
// printf("Back to original file");


//     return 0;


  
  
// }


#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
int main(int argc, char *argv[])
 {
    int i = 5;
    char *args[] = {"Data has been passed to the new process", NULL};

    if(fork() == 0)
    {
        execv("hello", args);
        i++;
        printf(" i = %d\n",i);
    }
    else
    {
        printf(" id = %d\n",getpid());
    }

     return 0;
 }

// #include <stdio.h>
// #include <unistd.h>
// int main(void) {
//   printf("Main program started\n");
//   char* argv[] = { "jim", "jams", NULL };
//   char* envp[] = { "some", "environment", NULL };
//   if (execve("hello", argv, envp) == -1)
//     perror("Could not execve");
//   return 1;
// }