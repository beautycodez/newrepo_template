-- Table structure for table 'inventory'
CREATE TABLE IF NOT EXISTS public.cart
(
	cart_id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	inv_id integer NOT NULL,
    account_id integer NOT NULL,
	CONSTRAINT cart_pkey PRIMARY KEY (cart_id)
);

-- Create relationship between 'account' and 'cart' tables
ALTER TABLE IF EXISTS public.cart
	ADD CONSTRAINT fk_account FOREIGN KEY (account_id)
	REFERENCES public.account (account_id) MATCH SIMPLE
	ON UPDATE CASCADE
	ON DELETE NO ACTION;

-- Create relationship between 'inventory' and 'cart' tables
ALTER TABLE IF EXISTS public.cart
	ADD CONSTRAINT fk_inventory FOREIGN KEY (inv_id)
	REFERENCES public.inventory (inv_id) MATCH SIMPLE
	ON UPDATE CASCADE
	ON DELETE NO ACTION;