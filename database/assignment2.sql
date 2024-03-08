-- Insert data
INSERT INTO account
	(account_firstname, account_lastname, account_email, account_password)
VALUES
	('Tony','Stark','tony@starkent.com','Iam1ronM@n');

-- Update the account type for account_id = 1
UPDATE
	account
SET
	account_type = 'Admin'
WHERE
	account_id = 1;

-- Delete the first row in the account table
DELETE
FROM
	account
WHERE
	account_id = 1;

-- Replace 'small interiors' for 'a huge interior' in GM Hummer
UPDATE
	inventory
SET
	inv_description = REPLACE(inv_description, 'small interiors','a huge interior')
WHERE
	inv_make = 'GM' AND inv_model = 'Hummer';

-- Show the Inv_make, inv_model, and Classification_name WHERE classification_name is "Sport"
SELECT 
	inv_make, inv_model, classification_name
FROM 
	inventory
INNER JOIN classification
	ON inventory.classification_id = classification.classification_id
WHERE 
	classification_name = 'Sport';

-- Update the inv_image and inv_thumbnail and add /vehicles/ in the middle
UPDATE 
	inventory
SET
	inv_image = REPLACE(inv_image, '/images/','/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail,'/images/','/images/vehicles/');
