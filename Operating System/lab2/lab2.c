#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <sys/types.h>
#include <sys/shm.h>
#include <sys/wait.h>
#define KEY 4567
#define PERMS 0660


int main(int argc, char **argv) {
  int id;
  int i;
  int *ptr;
  system("ipcs -m"); // pass a command to the shell, in this case the argument we put is used to displays shared memory segments.

  id = shmget(KEY, sizeof(int), IPC_CREAT | PERMS); //creates and stores the identifier of the shared memory in the variable id
  system("ipcs -m"); // pass a command to the shell, in this case the argument we put is used to displays shared memory segments.

    ptr = (int *) shmat(id, NULL, 0); // stores the segment's starting adress in ptr. It attaches the shared memory segment associated 
                                      // with the id we got with shmget(), 
  *ptr = 54; // We assigne a new value at the adress of ptr.  
  i = 54;
  if (fork() == 0) { // we create a new process
    (*ptr)++; //increments the value of *ptrds
    i++; // increments the value of i
    printf("Value of *ptr = %d\nValue of i = %d\n", *ptr, i); //displays in the command line the value of *ptr and i 
    exit(0); //terminates the program
  } else {
    wait(NULL); //blocks parent process
    printf("Value of *ptr = %d\nValue of i = %d\n", *ptr, i); //displays in the command line the value of *ptr and i 
    shmctl(id, IPC_RMID, NULL); // removes the shared memory segment id 
  }
}