# Lab 4 - v2 : Network analysis

 

## III. The basic HTTP GET/response interaction



### 	1. Retrieve HTML file



##### Q1) Is your browser running HTTP version 1.0 or 1.1? What version of HTTP is the server running?

Our browser is running HTTP version 1.1.

![Q1](C:\Users\crouz\Desktop\Q1.JPG)



##### Q2) What languages (if any) does your browser indicate that it can accept to the server? 

It can accept *fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7*.

![Q2](C:\Users\crouz\Desktop\Q2.JPG)



##### Q3) What is the IP address of your computer? Of the gaia.cs.umass.edu server? 

The IP address of my computer is 192.168.1.46 (source) and the IP adress of the gaia.cs.umass.edu server is 128.119.245.12 (destination).



##### Q4) What is the status code returned from the server to your browser? 

The status code returned from the server is 200 OK.

![Q4](C:\Users\crouz\Desktop\Q4.jpg)



##### Q5) When (hour and date) was the HTML file that you are retrieving has been received? 

The file has been received on the 12 Nov 2021 at 06:59:01 GMT.

![q5](C:\Users\crouz\Desktop\q5.jpg)



##### Q6) How many bytes of content are being returned to your browser?

128 bytes if content are being returned.

![q6](C:\Users\crouz\Desktop\q6.jpg)



##### Q7) By inspecting the raw data in the packet content window, do you see any headers within the data that are not displayed in the packet-listing window? If so, name one. 

No, there are no header within the data that are not displayed.



### 	2. Retrieving Long Documents



##### Q8) How many HTTP GET request messages did your browser send? Which packet number in the trace contains the GET message for the US Bill or Rights?

Our browser sent 1 HTTP GET request message. The packet 304 contains the GET message.

![q8](C:\Users\crouz\Desktop\q8.PNG)



##### Q9) Which packet number in the trace contains the status code and phrase associated with the response to the HTTP GET request?

The packet 878 contains the status code and phrase associated GET response.

![Q9](C:\Users\crouz\Desktop\Q9.png)



##### Q10) What is the status code and phrase in the response?

The status code and phrase in the response is 200 OK.

![q10](C:\Users\crouz\Desktop\q10.PNG)



##### Q11) How many data-containing TCP segments were needed to carry the single HTTP response and the text of the Bill of Rights?

4 reassembled TCP segments were needed.

![q11](C:\Users\crouz\Desktop\q11.PNG)



## IV. DNS



### 	1. nslookup



##### Q12) Explain briefly the second command line nslookup –type=NS ece.fr 

This command asks the DNS server to send us the IP address for the host www.ece.fr. We add -type=NS to display the subdomains.



##### Q13) Run nslookup to obtain the IP address of google web server for .fr, .de and .com. Comment the obtained result.

![q12](C:\Users\crouz\Desktop\q12.PNG)

We can notice that the three have the same address but their addresses are different. We can also notice that 



### 	2. Tracing DNS



##### Q14) Use your “ipconfig/all” (windows) to get more information about your network. If you are on Linux you can use the command line “nmcli dev list”

We type ipconfig/all in the command prompt.



##### Q15) Locate the DNS query and response messages for www.ece.fr . To filter the query and response add in your filter the expression (dns.qry.name contains www.ece.fr ). Are these messages sent over UDP or TCP? 

These messages are sent over UDP.

![q15](C:\Users\crouz\Desktop\q15.PNG)



##### Q16) What is the destination port for the DNS query message? What is the source port of DNS response message? 

The destination port for the DNS query message is 53 and the source port of DNS response message is 56480.

![q16](C:\Users\crouz\Desktop\q16.PNG)



##### Q17) To what IP address is the DNS query message sent? Use ipconfig to determine the IP address of your local DNS server. Are these two IP addresses the same? Use the result of ipconfig/all to answer. 

It is sent to 192.168.1.254 as we can see on the top of the previous screenshot. Our local DNS server's IP address is the same.



##### Q18) Examine the DNS query message. What “Type” of DNS query is it? Does the query message contain any “answers”?

It is type A. It doesn't contain any answer.

![q18](C:\Users\crouz\Desktop\q18.PNG)



##### Q19) Examine the DNS response message. How many “answers” are provided? What do each of these answers contain?

It contains 3 answers. It corresponds to each level to reach ece.fr.

![q19](C:\Users\crouz\Desktop\q19.PNG)



##### Q20) Consider the subsequent TCP SYN packet sent by your host. Does the destination IP address of the SYN packet correspond to any of the IP addresses provided in the DNS response message? Propose a filter expression to capture only SYN packets. 

