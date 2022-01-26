-- ------------------------------------------------------
-- NOTE: DO NOT REMOVE OR ALTER ANY LINE FROM THIS SCRIPT
-- ------------------------------------------------------

select 'Query 00' as '';
-- Show execution context
select current_date(), current_time(), user(), database();
-- Conform to standard group by constructs
set session sql_mode = 'ONLY_FULL_GROUP_BY';

-- Write the SQL queries that return the information below:
-- Ecrire les requêtes SQL retournant les informations ci-dessous:

select 'Query 01' as '';
-- The countries of residence the supplier had to ship products to in 2014
-- Les pays de résidence où le fournisseur a dû envoyer des produits en 2014
select
  distinct residence
from
  customers
  inner join orders on customers.cid = orders.cid
where
  YEAR(orders.odate) = '2014'
  and customers.residence is not null;

select 'Query 02' as '';
-- For each known country of origin, its name, the number of products from that country, their lowest price, their highest price
-- Pour chaque pays d'orgine connu, son nom, le nombre de produits de ce pays, leur plus bas prix, leur plus haut prix
select
  products.origin,
  count(*) as nb_prd,
  min(products.price),
  max(products.price)
from
  products
where
  origin is not null
group by
  products.origin;

select 'Query 03' as '';
-- The customers who ordered in 2014 all the products (at least) that the customers named 'Smith' ordered in 2013
-- Les clients ayant commandé en 2014 tous les produits (au moins) commandés par les clients nommés 'Smith' en 2013
select
  distinct customers.*
from
    orders inner join customers on customers.cid = orders.cid
where
  orders.pid in (
    select
      orders.pid
    from
      customers
      inner join orders on customers.cid = orders.cid
    where
      YEAR(orders.odate) = '2013'
      and customers.cname = 'Smith'
  )
  and YEAR(orders.odate) = '2014'
  and customers.cname <> 'Smith'
  and customers.cname is not null
  group by (orders.cid)
  having count(orders.pid) >= (select count(distinct orders.pid) from customers inner join orders on customers.cid = orders.cid where YEAR(orders.odate) = '2013' and customers.cname = 'Smith')
  order by customers.cid asc;

select 'Query 04' as '';
-- For each customer and each product, the customer's name, the product's name, the total amount ordered by the customer for that product,
-- sorted by customer name (alphabetical order), then by total amount ordered (highest value first), then by product id (ascending order)
-- Par client et par produit, le nom du client, le nom du produit, le montant total de ce produit commandé par le client, 
-- trié par nom de client (ordre alphabétique), puis par montant total commandé (plus grance valeur d'abord), puis par id de produit (croissant)
SELECT
  customers.cname,
  products.pname,
  SUM(orders.quantity * products.price)
FROM
  customers NATURAL
  JOIN products NATURAL
  JOIN orders
where customers.cname is not null
GROUP BY
  customers.cid,
  products.pid
ORDER BY
  customers.cname ASC,
  SUM(orders.quantity) DESC,
  products.pid ASC;

select 'Query 05' as '';
-- The customers who only ordered products originating from their country
-- Les clients n'ayant commandé que des produits provenant de leur pays
select distinct
  customers.*
from
  customers
  inner join orders on customers.cid = orders.cid
  inner join products on orders.pid = products.pid
where
  products.origin = customers.residence and customers.cname is not null
  and customers.cid not in (
    select
      customers.cid
    from
      customers
      inner join orders on customers.cid = orders.cid
      inner join products on orders.pid = products.pid
    where
      products.origin <> customers.residence
  )
order by customers.cid asc;

select 'Query 06' as '';
-- The customers who ordered only products originating from foreign countries 
-- Les clients n'ayant commandé que des produits provenant de pays étrangers
select distinct
  customers.*
from
  customers
  inner join orders on customers.cid = orders.cid
  inner join products on orders.pid = products.pid
where
  products.origin <> customers.residence
  and customers.cname is not null
  and customers.cid not in (
    select
      customers.cid
    from
      customers
      inner join orders on customers.cid = orders.cid
      inner join products on orders.pid = products.pid
    where
      products.origin = customers.residence
  )
order by customers.cid asc;

select 'Query 07' as '';
-- The difference between 'USA' residents' per-order average quantity and 'France' residents' (USA - France)
-- La différence entre quantité moyenne par commande des clients résidant aux 'USA' et celle des clients résidant en 'France' (USA - France)
select
  AVG(orders.quantity) - (
    select
      AVG(orders.quantity)
    from
      orders
      inner join customers on orders.cid = customers.cid
    where
      customers.residence = 'France'
  )
from
  orders
  inner join customers on orders.cid = customers.cid
where
  customers.residence = 'USA';

select 'Query 08' as '';
-- The products ordered throughout 2014, i.e. ordered each month of that year
-- Les produits commandés tout au long de 2014, i.e. commandés chaque mois de cette année
select
  products.*
from
  products
where
  (
    select
      count(distinct month(odate))
    from
      orders
    where
      orders.pid = products.pid
      and YEAR(orders.odate) = '2014'
  ) = 12
order by products.pid asc;

select 'Query 09' as '';
-- The customers who ordered all the products that cost less than $5
-- Les clients ayant commandé tous les produits de moins de $5
select
  t1.cid,
  t1.cname,
  t1.residence
from
  (
    select
      count(*) as cnt
    from
      products
    where
      products.price < 5
  ) as t2
  inner join (
    select
      count(distinct orders.pid) as cnt,
      customers.cid,
      customers.cname,
      customers.residence
    from
      orders
      inner join products on orders.pid = products.pid
      inner join customers on customers.cid = orders.cid
    where
      products.price < 5 and customers.cname is not null
    group by
      orders.cid
  ) as t1 on t2.cnt = t1.cnt
order by t1.cid asc;

select 'Query 10' as '';
-- The customers who ordered the greatest number of common products. Display 3 columns: cname1, cname2, number of common products, with cname1 < cname2
-- Les clients ayant commandé le grand nombre de produits commums. Afficher 3 colonnes : cname1, cname2, nombre de produits communs, avec cname1 < cname2
select
  t1.cname as cn1,
  t2.cname as cn2,
  count(distinct t1.pid) as cnt
from
  (
    select
      *
    from
      customers natural
      join orders
  ) as t1
  inner join (
    select
      *
    from
      customers natural
      join orders
  ) as t2 on t1.pid = t2.pid
where
  t1.cname < t2.cname
group by
  t1.cid,
  t2.cid,
  t1.cname,
  t2.cname
having
  cnt = (
    select
      max(cnt)
    from
      (
        select
          t1.cname as cn1,
          t2.cname as cn2,
          count(distinct t1.pid) as cnt
        from
          (
            select
              *
            from
              customers natural
              join orders
          ) as t1
          inner join (
            select
              *
            from
              customers natural
              join orders
          ) as t2 on t1.pid = t2.pid
        where
          t1.cid <> t2.cid
          and t1.cname < t2.cname
        group by
          t1.cid,
          t2.cid,
          t1.cname,
          t2.cname
      ) as t3
  );

select 'Query 11' as '';
-- The customers who ordered the largest number of products
-- Les clients ayant commandé le plus grand nombre de produits
select
  theT.cid,
  theT.cname,
  theT.residence
from
  (
    select
      max(t.som),
      customers.cid,
      customers.cname,
      customers.residence
    from
      (
        select
          o.cid,
          sum(o.quantity) as som
        from
          orders o
        group by
          o.cid
      ) as t
      inner join customers on customers.cid = t.cid
  ) as theT
order by theT.cid asc;

select 'Query 12' as '';
-- The products ordered by all the customers living in 'France'
-- Les produits commandés par tous les clients vivant en 'France'
SELECT
  distinct products.*
FROM
  products NATURAL
  JOIN orders NATURAL
  JOIN customers
WHERE
  residence = 'France';

select 'Query 13' as '';
-- The customers who live in the same country customers named 'Smith' live in (customers 'Smith' not shown in the result)
-- Les clients résidant dans les mêmes pays que les clients nommés 'Smith' (en excluant les Smith de la liste affichée)
select
  customers.*
from
  customers
where
  customers.residence in (
    select
      customers.residence
    from
      customers
    where
      customers.cname = 'Smith'
  )
  and customers.cname <> 'Smith'
  and customers.cname is not null
order by customers.cid asc;

select 'Query 14' as '';
-- The customers who ordered the largest total amount in 2014
-- Les clients ayant commandé pour le plus grand montant total sur 2014 
select taba.cid, taba.cname, taba.residence
from 
(select *,max(som) from 
  (SELECT
    customers.cname,
    customers.cid,
    customers.residence,
    SUM(orders.quantity * products.price) as som
  FROM
    products NATURAL
    join orders natural
    JOIN customers
  GROUP BY
    customers.cid) as tab
  where tab.cname is not null) as taba
order by taba.cid asc;

select 'Query 15' as '';
-- The products with the largest per-order average amount 
-- Les produits dont le montant moyen par commande est le plus élevé
select
  *
from
  products
where
  pid in (
    select
      pid
    from
      (
        select
          pid,
          avg(quantity * price) amountByCmd
        from
          orders natural
          join products
        group by
          pid
      ) averageAmount
    where
      amountByCmd = (
        select
          max(amountByCmd)
        from
          (
            select
              pid,
              avg(quantity * price) amountByCmd
            from
              orders natural
              join products
            group by
              pid
          ) highestAverageAmount
      )
  )
order by products.pid asc;

select 'Query 16' as '';
-- The products ordered by the customers living in 'USA'
-- Les produits commandés par les clients résidant aux 'USA'
SELECT
  DISTINCT products.*
FROM
  products 
  NATURAL JOIN orders natural join customers
WHERE
  residence = 'USA'
order by products.pid asc;

select 'Query 17' as '';
-- The pairs of customers who ordered the same product en 2014, and that product. Display 3 columns: cname1, cname2, pname, with cname1 < cname2
-- Les paires de client ayant commandé le même produit en 2014, et ce produit. Afficher 3 colonnes : cname1, cname2, pname, avec cname1 < cname2
select
  distinct t1.cn1,
  t2.cn2,
  t1.pn1
from
  (
    select
      customers.cname as cn1,
      products.pname as pn1,
      orders.cid as ci1,
      orders.pid as pi1
    from
      customers natural
      join orders natural
      join products
    where
      YEAR(orders.odate) = '2014'
  ) as t1
  left join (
    select
      customers.cname as cn2,
      products.pname as pn2,
      orders.cid as ci2,
      orders.pid as pi2
    from
      customers natural
      join orders natural
      join products
    where
      YEAR(orders.odate) = '2014'
  ) as t2
  on t1.pi1 = t2.pi2 and t1.ci1 <> t2.ci2
  where t1.cn1<t2.cn2
  group by t1.cn1, t2.cn2, t1.pn1;

select 'Query 18' as '';
-- The products whose price is greater than all products from 'India'
-- Les produits plus chers que tous les produits d'origine 'India'
select
  products.*
from
  products
where
  products.price > (
    select
      MAX(products.price)
    from
      products
    where
      products.origin = 'India'
  )
  and products.origin <> 'India'
  order by products.pid asc;

select 'Query 19' as '';
-- The products ordered by the smallest number of customers (products never ordered are excluded)
-- Les produits commandés par le plus petit nombre de clients (les produits jamais commandés sont exclus)
select
  rslt.pid, rslt.pname, rslt.price, rslt.origin
from
  (
    select
      products.pid,
      products.pname,
      products.price,
      products.origin,
      min(t.cnt) as mini
    from
      (
        select
          orders.pid,
          count(distinct orders.cid) as cnt
        from
          orders
        group by
          orders.pid
      ) as t
      inner join products on products.pid = t.pid
  ) as rslt
order by rslt.pid asc;

select 'Query 20' as '';
-- For all countries listed in tables products or customers, including unknown countries: the name of the country, the number of customers living in this country, the number of products originating from that country
-- Pour chaque pays listé dans les tables products ou customers, y compris les pays inconnus : le nom du pays, le nombre de clients résidant dans ce pays, le nombre de produits provenant de ce pays 
(select
  null,
  (
    select
      count(cid) as cnt
    from
      customers
    where
      customers.residence is null
  ) as nTable1,
  (
    select
      count(pid) as cnt
    from
      products
    where
      products.origin is null
  ) as nTable2)
UNION
(select
    tab1.pays as country,
    tab2.cnt as nbr_cust,
    tab3.cnt as nbr_prod
  from
    (
      select
        customers.residence as pays
      from
        customers
      where
        residence is not null
      group by
        customers.residence
      union
      select
        products.origin as pays
      from
        products
      where
        origin is not null
      group by
        products.origin
    ) as tab1
    left join (
      select
        residence as pays,
        count(*) as cnt
      from
        customers
      group by
        residence
    ) as tab2 on tab1.pays = tab2.pays
    left join (
      select
        origin as pays,
        count(*) as cnt
      from
        products
      group by
        origin
    ) as tab3 on tab1.pays = tab3.pays);