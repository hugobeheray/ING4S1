Hugo BEHERAY, Zoé CROUZET, Group1

# Lab5 : Virtual Memory



### Part 1 : Contiguous Allocation



Our code is based on 2 structs : the **memory** (type `mem_t`) and the **holes** (type `hole_t`). The memory is composed with a vector of holes, which represents places in the memory where nothing is allocated. A hole has a **size** and a **address**.



#### 	1. Initialization of the memory

The first step is to **initialize the memory** with the function `initMem()` which returns a memory. This function creates the first hole and put it inside the memory. Its address is 0 and its size is the size of the whole memory.

![image-20211212132030926](C:\Users\crouz\AppData\Roaming\Typora\typora-user-images\image-20211212132030926.png)

This is the code for initialization :

```C++
// dynamically allocates a mem_t structure and initializes its content
mem_t initMem()
{
    mem_t mem;

    std::vector<hole_t> root;

    // we create a the first hole at address 0 and with size of all the memory
    hole_t firstHole;
    firstHole.adr = 0;
    firstHole.sz = SIZE;

    // we put it into the vector of holes
    root.push_back(firstHole);

    // we put the vector into the memory
    mem.root = root;

    return mem;
}
```



#### 	2. Allocation of the memory

The second step is the allocation of the memory. Let's take this example : the memory already have 3 allocation at the address 8, 15 and 30 with the respective size of 2, 4 and 3. ![image-20211212133910241](C:\Users\crouz\AppData\Roaming\Typora\typora-user-images\image-20211212133910241.png)

Now, we want to allocate something that has a size of 9. The allocation function will browse the holes in order to put the new allocation in the first hole that is big enough. In this example, that would be hole[2]. After that, the holes would look like this :

![image-20211212134732235](C:\Users\crouz\AppData\Roaming\Typora\typora-user-images\image-20211212134732235.png)

If the new allocation is exactly the size of the hole, the hole is removed. Also, if there is any big enough hole, the allocate function returns -1.



This is our code for allocation : 

```c++
// allocates space in bytes (byte_t) using First-Fit, Best-Fit or Worst-Fit
address_t myAlloc(mem_t *mp, int sz)
{
    for (int i = 0; i < mp->root.size(); i++)
    {
        // if the hole is big enough we decrease the size of the hole by the new size
        if (sz < mp->root[i].sz)
        {
            mp->root[i].sz -= sz;	// decrease the size of the hole
            mp->root[i].adr += sz;	// increase the address of the hole

            return mp->root[i].adr - sz;	// return the address of the alloc
        }
        // if the hole is exactly the size of the alloc, we remove the hole
        else if(sz == mp->root[i].sz)
        {
            address_t ad = mp->root[i].adr - sz;	// put in a variable the address of the alloc

            mp->root.erase(mp->root.begin() + i); // delete the hole

            return ad; // return the address of the alloc
        }
    }
    std::cout << "No more available space in the memory";
    return -1;	// return -1 if the alloc is not possible
};
```



#### 	3. Free memory

When we are done using an allocation, we have to free the memory. This is made of 4 cases.



##### 	*Case 1 : There is a hole on the right and on the left*

Let's say we want to free the allocation at address 15. This is the case where there is no hole on the left and on the right. We can remove hole[2] and add hole[2]' size and the allocation size to hole[1]. In this case, the address of the hole is still the same.

![image-20211212140207111](C:\Users\crouz\AppData\Roaming\Typora\typora-user-images\image-20211212140207111.png)



##### 	*Case 2 : There is a hole on the right but not on the left*

Let's say we want to free the allocation at address 19. This is the case where there is a hole on the right but not on the left. We don't remove any hole but hole[2]'s address will be decreased by the size of the allocation and its size will be increased by the size of the allocation.

![image-20211212140903675](C:\Users\crouz\AppData\Roaming\Typora\typora-user-images\image-20211212140903675.png)



##### 	*Case 3 : There is a hole on the left but not on the right*

This case is almost the same as the previous one. The difference is that we will only increase the size of the previous hole by the size of the allocation and do thing more.



##### 	*Case 4 : There is a hole on both sides*

This case happens when we want to free an allocation which is between 2 allocs. You can see an example of this situation below. In this case, we have to create a new hole between hole 1 and 2 which will have the size and the address of the allocation we want to free.

![image-20211212142213378](C:\Users\crouz\AppData\Roaming\Typora\typora-user-images\image-20211212142213378.png)



This is the code for free (4 cases):

```C++
// release memory that has already been allocated previously
void myFree(mem_t *mp, address_t p, int sz)
{
    // boolean to know if there is a hole on at least on side
    bool holeOnSides = false;

    // browse the holes
    for (int j = 0; j < mp->root.size(); j++)
    {
        // CASE 1 : There is a hole on the right and on the left
        if (mp->root[j].adr == p + sz  && (j!=0 && (mp->root[j-1].adr + mp->root[j-1].sz) == p))
        {
            std::cout << "\nHole on both sides";
            // we increase size of the previous hole with the size of the hole + the size of thee previous hole + the size of the free
            mp->root[j - 1].sz = mp->root[j - 1].sz + mp->root[j].sz + sz;	// new size of the hole
            mp->root.erase(mp->root.begin() + j);	// erase the next hole

            holeOnSides = true;	// there is a hole on at least one side

            // we end the loop
            j = mp->root.size();
        }
        
        // CASE 2 : There is a hole on the right but not on the left
        else if (mp->root[j].adr == p + sz && (j==0 || (mp->root[j-1].adr + mp->root[j-1].sz) != p))
        {
            std::cout << "\nHole on the right but not on the left";
            // we increase size of the previous hole with the size of the hole + the size of the free
            mp->root[j].sz = mp->root[j].sz + sz;	// new size of the hole
            mp->root[j].adr -= sz;	// new address of the hole

            holeOnSides = true;	// there is a hole on at least one side

            // we end the loop
            j = mp->root.size();
        }

        // CASE 3 : There is a hole on the left but not on the right
        else if (mp->root[j].adr != p + sz && (j!=0 && (mp->root[j-1].adr + mp->root[j-1].sz) == p))
        {
            std::cout << "\nHole on the left but not on the right";
            // we increase size of the previous hole with the size of the hole + the size of the free
            mp->root[j].sz = mp->root[j].sz + sz;	// new size of the hole

            holeOnSides = true;	// there is a hole on at least one side

            // we end the loop
            j = mp->root.size();
        }
    }

    // if there is no hole on the sides
    if(!holeOnSides){
        // CASE 4 : There is an alloc on both sides
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
```



#### 	4. Write

Writing consists of assigning a value to a byte.

```c++
// assign a value to a byte
void myWrite(mem_t *mp, address_t p, byte_t val)
{
    mp->mem[p]=val;
};
```





#### 	5. Read

This part consist of reading memory from a byte.

```c++
// read memory from a byte
byte_t myRead(mem_t *mp, address_t p)
{
    return mp->mem[p];
};
```





#### 	6. Our entire code

```C++
#ifndef __MMU__H__
#define __MMU__H__
#define SIZE 65536
#include <vector>
#include<iostream>

typedef short byte_t;

typedef int address_t;

// structure of a hole : an address and a size
typedef struct hole
{
    address_t adr;
    int sz;
} hole_t;

// structure of a memory : a size and a vector of holes
typedef struct
{
    byte_t mem[SIZE];
    std::vector<hole_t> root;
} mem_t;

// dynamically allocates a mem_t structure and initializes its content
mem_t initMem()
{
    mem_t mem;

    std::vector<hole_t> root;

    // we create a the first hole at address 0 and with size of all the memory
    hole_t firstHole;
    firstHole.adr = 0;
    firstHole.sz = SIZE;

    // we put it into the vector of holes
    root.push_back(firstHole);

    // we put the vector into the memory
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
            mp->root[i].sz -= sz;	// decrease the size of the hole
            mp->root[i].adr += sz;	// increase the address of the hole

            return mp->root[i].adr - sz;	// return the address of the alloc
        }
        // if the hole is exactly the size of the alloc, we remove the hole
        else if(sz == mp->root[i].sz)
        {
            address_t ad = mp->root[i].adr - sz;	// put in a variable the address of the alloc

            mp->root.erase(mp->root.begin() + i); // delete the hole

            return ad; // return the address of the alloc
        }
    }
    std::cout << "No more available space in the memory";
    return -1;	// return -1 if the alloc is not possible
};

// release memory that has already been allocated previously
void myFree(mem_t *mp, address_t p, int sz)
{
    // boolean to know if there is a hole on at least on side
    bool holeOnSides = false;

    // browse the holes
    for (int j = 0; j < mp->root.size(); j++)
    {
        // CASE 1 : There is a hole on the right and on the left
        if (mp->root[j].adr == p + sz  && (j!=0 && (mp->root[j-1].adr + mp->root[j-1].sz) == p))
        {
            std::cout << "\nHole on both sides";
            // we increase size of the previous hole with the size of the hole + the size of thee previous hole + the size of the free
            mp->root[j - 1].sz = mp->root[j - 1].sz + mp->root[j].sz + sz;	// new size of the hole
            mp->root.erase(mp->root.begin() + j);	// erase the next hole

            holeOnSides = true;	// there is a hole on at least one side

            // we end the loop
            j = mp->root.size();
        }
        
        // CASE 2 : There is a hole on the right but not on the left
        else if (mp->root[j].adr == p + sz && (j==0 || (mp->root[j-1].adr + mp->root[j-1].sz) != p))
        {
            std::cout << "\nHole on the right but not on the left";
            // we increase size of the previous hole with the size of the hole + the size of the free
            mp->root[j].sz = mp->root[j].sz + sz;	// new size of the hole
            mp->root[j].adr -= sz;	// new address of the hole

            holeOnSides = true;	// there is a hole on at least one side

            // we end the loop
            j = mp->root.size();
        }

        // CASE 3 : There is a hole on the left but not on the right
        else if (mp->root[j].adr != p + sz && (j!=0 && (mp->root[j-1].adr + mp->root[j-1].sz) == p))
        {
            std::cout << "\nHole on the left but not on the right";
            // we increase size of the previous hole with the size of the hole + the size of the free
            mp->root[j].sz = mp->root[j].sz + sz;	// new size of the hole

            holeOnSides = true;	// there is a hole on at least one side

            // we end the loop
            j = mp->root.size();
        }
    }

    // if there is no hole on the sides
    if(!holeOnSides){
        // CASE 4 : There is an alloc on both sides
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
void myWrite(mem_t *mp, address_t p, byte_t val)
{
    mp->mem[p]=val;
};

// read memory from a byte
byte_t myRead(mem_t *mp, address_t p)
{
    return mp->mem[p];
};

#endif

int main()
{
    // initialization of the memory
    mem_t tempMem = initMem();
    mem_t *mem = &tempMem;	// we put it in a pointer so that we can modifiy it in the functions

    // allocation of 3 addresses
    address_t adr1 = myAlloc(mem, 5);	// new address with size of 5 in the memory
    address_t adr2 = myAlloc(mem, 10);	// new address with size of 10 in the memory
    address_t adr3 = myAlloc(mem, 100); // new address with size of 100 in the memory

    // free of 2 addresses
    myFree(mem, adr2, 10);	// free address 2 with size of 10
    myFree(mem, adr1, 5);	// free address 1 with size of 5

    myWrite(mem, adr3, 543);    // write on the 1st byte
    myWrite(mem, adr3 + 9, 34); // write on the 10th byte
    byte_t val1 = myRead(mem, adr3);	//
    byte_t val2 = myRead(mem, adr3 + 9);
}
```





### Part 2 : Paging

For this part, we have to create 3 elements: the **virtual memory**, the **physical memory** and the **page table**. The page table is the link between virtual and physical memory.

The difference between part 1 and 2 is that in part 1 we were just **allocating** space so we only had to know if thats accessible. In this part, we are **storing** something in it so we have to know whats inside.



#### Steps

When we start, the memory is empty.

1) Find the number of contiguous words inside log memory. That is what we did in the previous part.

2) For each page used, find a free frame and update the page table.

3. Return to 1.



This is the representation of what we should implement in this part :

![image-20211212163354273](C:\Users\crouz\AppData\Roaming\Typora\typora-user-images\image-20211212163354273.png)