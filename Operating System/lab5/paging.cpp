#ifndef __MMU__H__
#define __MMU__H__
#define SIZE 65536
#include <vector>
#include <iostream>

typedef short byte_t;

typedef int address_t;

typedef struct hole
{
    address_t adr;
    int sz;
} hole_t;

typedef struct
{
    byte_t mem[SIZE];
    std::vector<hole_t> root;
} mem_t;

// dynamically allocates a mem_t structure and initializes its content
mem_t initMem()
{
}

// allocates space in bytes (byte_t) using First-Fit, Best-Fit or Worst-Fit
address_t myAllocCont(mem_t *mp, int sz)
{
};

// release memory that has already been allocated previously
void myContFree(mem_t *mp, address_t p, int sz)
{
};

#endif

int main()
{
    mem_t tempMem = initMem();
    mem_t *mem = &tempMem;

    address_t adr1 = myAllocCont(mem, 5);
    address_t adr2 = myAllocCont(mem, 10);
    address_t adr3 = myAllocCont(mem, 100);

    myContFree(mem, adr2, 10);
    myContFree(mem, adr1, 5);
}