# **Assignment 2 : Transactions in SQL**

##### *Hugo BEHERAY - Clément FAGES*

##### ***Assignment 2 BDD** - 19/10/2021*



### **Preamble**

To complete this lab we have installed MySQL Workbench instead of *WampServer* to launch queries and have more options for our work. For example we can disable the *autocommit* on Workbench which doesn’t exist on *WampServer*. Now we can start our work by writing ‘start transaction’ in order to do commit or rollback. We have imported the script *‘company.sql’* from campus on Workbench to get some data (database, tables, tuples..).

### **Tasks**

1. ##### Commit and rollback

   The transaction should look like that :

   ```sql
   start transaction;
   insert into *dept* values ('50', 'IT', 'PARIS');
   select * from dept;
   rollback;
   select * from dept;
   ```

   First, we start a new transaction by writing *‘start transaction*’. Then we insert a new value in the *dept* table. Next we select all the elements in the table *dept* and we have the following result :

   ![img](https://lh5.googleusercontent.com/Ic_3iSH7bAlnpSTzWiy3OHEDGiJJORFMiQSC_IaBOj6kJMyZW72Z_X_8z1Wy2MdXyCj9igppEHb8ixyHUsXb19bwcDyvt-E3a5wcgd-ej2C1VcbyIFZ2Q2nWkR3AQHHNDK5ECN8C=s0)

   Let’s do a *rollback* and re-select everything to see what happened (line 4 and 5) :

   ![img](https://lh6.googleusercontent.com/TpX0e4dSfjA_V6sJiYpkqn68Fs1WmIojk26s9IU62IB2S21zsPKQrowruEzwa68Zlr__80zqPvcnXLzNcwDKkQ3H1MxRDhBjVcnp6IYIS_MDPbPgiulvnWdvRy0Fk0k6YcQZ68Qc=s0)

   The table came back as it was. So it canceled the modifications. Here we try the same query with *commit* instead rollback :

   ```sql
   start transaction;
   insert into dept values ('50', 'IT', 'PARIS');
   select * from dept;
   commit;
   select * from dept;
   ```

   <u>Here is the result :</u>

   ![img](https://lh4.googleusercontent.com/e-_jIfAUD6PCtVBx9ndfugJh51lbx-6p0hI72hbdq_qHcaEqfT4Z3nlP3SBPwXZy1n-ETB8iVM3d3oEWBbi-cG_sXSsPJJ2Px3xqC5Wr6HpoXjkLhNUzm2bS96rO-cF-hTj0ndt9=s0)

   The insert has been saved, there is no difference between the two tables of the commits.

   

2. ##### Client failure

   The new query is the following :

   ```sql
   start transaction;
   insert into dept values ('60', 'PRODUCT', 'BERLIN');
   select * from dept;
   ```

   We started a new transaction and insert new *dept*. Then we select the elements from the table and we have this :

   ![img](https://lh4.googleusercontent.com/bd8NPoqniL5lkMUHkwZ0rhlaTRGtaWCEZ36-sfNUCkrMwRySxKc7FNFyTV9GGksD8nK4X-mEptHJM7o64QBKBVOMeZXY0ufRe5F_ewIq_V1ABdzAgNwPJ9PIjiXEWnV0z02ji2xX=s0)

   Now we close the tab by clicking here :![img](https://lh3.googleusercontent.com/5bcxgP_fNEokjgrpgFN7XWtcKEK57gUMVZnjpPkp9ZrJRd2GJBtGclQhK7XpyhzvJuNOqYJOP3nvs_Or1xzdfLwjp-y_LzZVRHA2B1u9J-bQ-A84ckH4XxVB3ceHChCrgZMqbO10=s0)

   Then we close MySQL to launch it again. We enter the following query again :

   ```sql
   select * from dept;
   ```

   We get this result :

   ![img](https://lh4.googleusercontent.com/Ns17Zb8n5EnWJzga0_YGI9CmURsruq4m1P8roi-1ABGd_wRwHtyL_Q4wLEsfyXUotIuYwXXphWobi58tvvgeSAg5bDoXD5KIbwyuyJpfGy4ThugXoLIsi37YaPcwa5LrDV6hC9Q-=s0)

   The insertion has not been saved because it is not in the table. As we didn’t commit it, the information modified have not been saved.

   Now we will try to repeat the operations but we will abruptly stop the process with the task manager.

   ![img](https://lh4.googleusercontent.com/z4Y2Oge6owtXjTcqOA1uxLtV8am2WU602d8I3z__S3fZIvq_CgGLECdzjOkjZvUxXwMDa6ugP13CcLP13cuhqE1aKjorakZZuxuZQxdy_ttJNWliPQiQRDGJ_z3ab99KkArBtvyJ=s0)
   We do a right click on the MySQL Workbench and stop the process. Now we re-open it and we select the tuples in the *dept* table.

   Here is the result :

   ![img](https://lh4.googleusercontent.com/IP9y_0OQbtwjZaEMO4NWIrJ-AMsMV8nas4602MTcMA4DDQ-OgvsWh3O3C8KaZvGyTWrG3pop3hPxOepklfl_1q5OMFTCTJb7TJtAF8Ih8pZPIxPtsObmkVo-L0O_iz8re7ilwK4t=s0)

   It didn’t save the transaction.
   So we conclude that if we don’t commit, modifications will not be saved.

   

3. ##### Transaction Isolation

   To get the default transaction isolation level of the database we have to enter the following command :

   ```sql
   ‘show variables like '%isolation%'’
   ```

   The value displayed is : ‘REPEATABLE-READ’.
   It means that if we do a read operation, it will use the snapshot information established by the first read to present query results based on a point in time regardless of changes performed by other transactions running at the same time.

   To do the experiment, we will create another connection to the database so we have two tabs :

   ![img](https://lh3.googleusercontent.com/FxEjnwYLI-id4xTkP8VnyQ0ha1qeO2x0sE1W7LB8t7jb7R9690BjAbV-JTG3njLrBOncSeZ37uoO7FNWl48-7jp0IeOOghSpOwYt_tvgCy8H6M4dbBy08eaTehmjdJ_PF4jUI4TH=s0)

   

   We will start two transactions and do operations on the exact same table from the same database.

   In the first connection we have this code :

   ```sql
   start transaction;
   insert into dept values ('60', 'PRODUCT', 'BERLIN');
   select * from dept;
   ```

   We launch it and we get this result :

   ![img](https://lh6.googleusercontent.com/UnvbX4wIBQacfOmtRttt5mohatBTXfC8AtGZ2kA-lEdOUY9X3ggDm3jfOKJh2j18_hXPa9xlTd7NqQTkQgJJlgiFGnVgVxkXKTDjtLuD01Sml0RNssvcp4B6DMGqG_ljtgzVsMNd=s0)

   The new tuple has been well inserted.
   In the other tab we also create a new transaction and we select the table *dept* from the database :

   ```sql
   start transaction;
   select * from dept;
   ```

   Here is the result :

   ![img](https://lh3.googleusercontent.com/VkpUJqSeFfX4AQ2jn2hRJwlPS95WAMu2oFY3v1eKG_ouEH6wOLi99lMxxWJfxo_ajYAmljfKATTRJ0le2nE5DAvmgvP8LKY0rtt5n0BhgvL7l-uIQ0pnneKKGTxpYxM5sW8ok-EZ=s0)

   The previous insertion is not displayed because it is not part of this transaction. 

   So the modifications a transaction makes to the database are only visible to that transaction. 

   

   Now we will repeat the experiment by deleting the department inserted previously.

   Let’s admit that we have the same database in the two transactions so that we can see if we delete a tuple in one, the other tuple will notice it. In the first connection we have now this code :

   ```sql
   start transaction;
   delete from dept where DID = 60;
   select * from dept;
   ```

   ![img](https://lh4.googleusercontent.com/eWXWDYXRkMXEOZ1IHpcIGc1i-lqfh24kl4IYYkzzXTeAhgwdBypR_vLEnacyJ0LpVI1wnUsITNOdBkGu8z_rhSJF3kNaMelvgcF0B6NpwSkEfHl-YsY0Ouq8hiCyGTwUuZRvwx18=s0)

   We can see that the has been deleted the tuple. 

   In the other tab we just select all the information from *dept* and we have this result :

   ![img](https://lh3.googleusercontent.com/AQSFDnYurmVDofYG7gap0h6Q-UXRLypeY0LMXUp_PaFVz-U74c14W2Usu99PDzycrCxlpBLF_jPx6Eb7DMOqS7-6ECh1t73y-JpYE5XrYXLMwzZ0zl8wptS6cF7wkXIeporwP7qO=s0)

   So the row has not been deleted in the second transaction via the second connection.

   

4. ##### Isolation levels

   We set the transaction level to read uncommitted thanks to this line of code :

   ```sql
   set session transaction isolation level READ UNCOMMITTED;
   show variables like '%isolation%';
   ```

   We get this output :

   ![img](https://lh6.googleusercontent.com/fMyN1KKOKj2QF5eLEMSS0OkhfIuNzMeZA4_UI8b5gqBugzK4DOxOpv7p-a2EVFB6zMfQbKaf0tlEusQTZpv9Fsx6d6xO3D-ZURqi5IJHqQPIxWbVHWckupquIr8WYMy2e3DossxR=s0)

   We will repeat the previous experiment with this value. 

   First, we will add a new tuple in the table *dept* in *WampServer* and refresh the database on Workbench. So then, we will delete it in one connection to see if the transaction in the second connection noticed it.
   Here is our first table :

   ![img](https://lh6.googleusercontent.com/QiyznKpf5CIDuibZqyfYfiT3C2ky-6pAIZoCAgKJ-z7K14NA_2CQPQIv9msYtP00m2SiMv4Ub_ncIS-SVeq_1vyNHhUATTgGDz-VO46RJ0oTmhg2lhPvKykzgSaOvba7E8zyq0vf=s0)

   Now we delete the last row :

   ```sql
   start transaction;
   delete from dept where DID = 60;
   select * from dept;
   ```

   Here is our new table :

   ![img](https://lh3.googleusercontent.com/Iqyjs-oBRdFEeQ7LsiEz_GnXVoGOxWo75GnLSOLiEW9wZx8C3s36Ucln4Ogz48rmEGSfxuz3a1tWM7EOfQFUEf9wlvhK8TtYKa8X7Q3g7jm-Cv186VwoISCe8kGgofdBtb9vdzzz=s0)

   Now in the other connection tab, we will select the elements of the table and see if the row has been deleted.

   ![img](https://lh5.googleusercontent.com/OWSWUce6iIaBz5coTqmE6vc9ASb0DFCpgDTo-v1s7EArwOnW01DHBewaiEDOq3pVt3l8E7k_y456af-FoaTAwgKOa5BXItUZZXKT-YqM6qouZn6ZPWY3fXFch9r68cGX5DXXsIBj=s0)

   The row has been deleted.
   The option *read uncommitted* allows that transaction may see uncommitted changes made by some other transaction.
   To modify the behavior from the previous exercise, we only have to edit one transaction. The transaction that must be edited is the one where we don’t delete the row and we just select the information from the table. Indeed it will be able to get elements from uncommitted transactions. However, we can change the isolation level in both tabs.

   

5. ##### Isolation levels - Continued

   Let’s set the isolation level to serializable :

   ```sql
   set session transaction isolation level serializable;
   ```

   This time we will add the row *(‘50’, ‘IT’, ‘PARIS’)* in the database :

   ```sql
   start transaction;
   insert into dept values ('50', 'IT', 'PARIS');
   select * from dept;
   ```

   Now we display the first table :

   ![img](https://lh4.googleusercontent.com/lHE41r5RU6OISExZja1e0Ai9QgFJH0jNmGFLyMw7QIQgzdWowKeTmCNK_6f6dzBiU5q2ePG8qyaNB0EqwlsMf2vasXmSQc0x8RNCneeO2oZ4UjLDHtELMfr8DuOW1c4F-mOOxoW6=s0)

   In the second connection we try to display the table by starting a new transaction :

   ![image-20211018165405162](C:\Users\clemf\AppData\Roaming\Typora\typora-user-images\image-20211018165405162.png)

   The query is running for a long time and nothing is displayed. The following screenshot is what I have on my screen :

   ![image-20211018165533068](C:\Users\clemf\AppData\Roaming\Typora\typora-user-images\image-20211018165533068.png)

   The query is running. We just try to select all the elements from *dept*.

   ![image-20211018165624537](C:\Users\clemf\AppData\Roaming\Typora\typora-user-images\image-20211018165624537.png)

   At the end of the query we got an error.

   Indeed, serializable requires read and write locks to be released at the end of the transaction. So we have to commit our first transaction from the first connection to get the values from the tab *dept* from the second transaction.

   If we commit our first transaction we get a result this time for the second transaction :

   ![img](https://lh4.googleusercontent.com/lHE41r5RU6OISExZja1e0Ai9QgFJH0jNmGFLyMw7QIQgzdWowKeTmCNK_6f6dzBiU5q2ePG8qyaNB0EqwlsMf2vasXmSQc0x8RNCneeO2oZ4UjLDHtELMfr8DuOW1c4F-mOOxoW6=s0)

   Exactly the same as the output from the first transaction.

6. ##### JBDC

To complete this part, we edited the code in *Test.java* and *DataAccess.java*.

To get the autocommit value we use this function : *getAutoCommit();*

To get the isolation level we use : *getTransactionIsolation();*

Then we added a try, catch condition around the statements and prepared statements. So if there is an error, we can rollback or commit at the end if everything was ok.
