#ifndef __MMU__H__
#define __MMU__H__
#define SIZE 65536
#include <vector>
#include<iostream>

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
    // We create a temporary memory and fill it with the information of the hole
    mem_t mem;

    std::vector<hole_t> root;

    hole_t firstHole;
    firstHole.adr = 0;
    firstHole.sz = SIZE;

    root.push_back(firstHole);

    mem.root = root;

    return mem;
}

// allocates space in bytes (byte_t) using First-Fit, Best-Fit or Worst-Fit
address_t myAlloc(mem_t *mp, int sz)
{
    for (int i = 0; i < mp->root.size(); i++)
    {
        // if the hole is big enough we decrease the size of the hole by the new size
        if (sz < mp->root[i].sz)
        {
            mp->root[i].sz -= sz;
            mp->root[i].adr += sz;

            return mp->root[i].adr - sz;
        }
        // is the hole is exactly the size of the alloc, we remove the hole
        else if(sz == mp->root[i].sz)
        {
            address_t ad = mp->root[i].adr - sz;

            mp->root.erase(mp->root.begin() + i);

            return ad;
        }
    }
    std::cout << "No more available space in the memory";
    return -1;
};

// release memory that has already been allocated previously
void myFree(mem_t *mp, address_t p, int sz)
{
    // boolean to know if there is a hole on at least on side
    bool holeOnSides = false;

    // on parcours la trou pour trouver à quelle position est le trou à enlever
    for (int j = 0; j < mp->root.size(); j++)
    {
        // if there is a hole on the right and on the left
        if (mp->root[j].adr == p + sz  && (j!=0 && (mp->root[j-1].adr + mp->root[j-1].sz) == p))
        {
            std::cout << "\nHole on both sides";
            // we increase size of the previous hole with the size of the hole + the size of thee previous hole + the size of the free
            mp->root[j - 1].sz = mp->root[j - 1].sz + mp->root[j].sz + sz;
            mp->root.erase(mp->root.begin() + j);

            holeOnSides = true;

            // we end the loop
            j = mp->root.size();
        }
        // if there is a hole on the right but not on the left
        else if (mp->root[j].adr == p + sz && (j==0 || (mp->root[j-1].adr + mp->root[j-1].sz) != p))
        {
            std::cout << "\nHole on the right but not on the left";
            // we increase size of the previous hole with the size of the hole + the size of the free
            mp->root[j].sz = mp->root[j].sz + sz;
            mp->root[j].adr -= sz;

            holeOnSides = true;

            // we end the loop
            j = mp->root.size();
        }

        // if there is a hole on the left but not on the right
        else if (mp->root[j].adr != p + sz && (j!=0 && (mp->root[j-1].adr + mp->root[j-1].sz) == p))
        {
            std::cout << "\nHole on the left but not on the right";
            // we increase size of the previous hole with the size of the hole + the size of the free
            mp->root[j].sz = mp->root[j].sz + sz;

            holeOnSides = true;

            // we end the loop
            j = mp->root.size();
        }
    }

    // if there is no hole on the sides
    if(!holeOnSides){
        // if there is an alloc on both sides
        for (int j = 0; j < mp->root.size(); j++){
            if(mp->root[j].adr != p + sz && (j==0 || (mp->root[j-1].adr + mp->root[j-1].sz) != p))
            {
                std::cout << "\nAlloc on the left and on the right";
                // we create a new hole at the current index
                hole_t newHole;
                newHole.adr = p;
                newHole.sz = sz;
                mp->root.insert(mp->root.begin() + j,newHole);
                //we end the loop
                j = mp->root.size();
            }
        }
    }
};

// assign a value to a byte
void myWrite(mem_t *mp, address_t p, byte_t val);

// read memory from a byte
byte_t myRead(mem_t *mp, address_t p);

#endif

int main()
{
    mem_t tempMem = initMem();
    mem_t *mem = &tempMem;

    address_t adr1 = myAlloc(mem, 5);
    address_t adr2 = myAlloc(mem, 10);
    address_t adr3 = myAlloc(mem, 100);

    for (int i = 0; i < mem->root.size(); i++){
        std::cout << mem->root[i].adr;
        std::cout << "\n";
    }    
    std::cout << "\n";

    myFree(mem, adr1, 5);

    for (int i = 0; i < mem->root.size(); i++){
        std::cout << mem->root[i].adr;
        std::cout << "\n";
    }
    std::cout << "\n";

    address_t adr4 = myAlloc(mem, 100);

    for (int i = 0; i < mem->root.size(); i++){
        std::cout << mem->root[i].adr;
        std::cout << "\n";
    }
    std::cout << "\n";

    // myWrite(mem, adr3, 543);    // write on the 1st byte
    // myWrite(mem, adr3 + 9, 34); // write on the 10th byte
    // byte_t val1 = myRead(mem, adr3);
    // byte_t val2 = myRead(mem, adr3 + 9);
}