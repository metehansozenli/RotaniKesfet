-- CREATE or Replace Function updateCityScore()
-- returns trigger as
-- $$
-- 	begin
-- 		UPDATE cities 
-- 		SET "cityScore" = (
-- 			SELECT ROUND(AVG("locationScore"),1)
-- 			FROM locations
-- 			WHERE "locationCityID" = NEW."locationCityID"
-- 		)
-- 		WHERE "cityID" = NEW."locationCityID";
-- 		return new;
-- 	end;
-- $$
-- language plpgsql;

-- CREATE TRIGGER updateCityScore_trigger
-- AFTER UPDATE OF "locationScore" ON locations
-- FOR EACH ROW EXECUTE FUNCTION updateCityScore();

-- CREATE or Replace Function updateLocationScore()
-- returns trigger as
-- $$
-- 	begin
-- 		UPDATE locations 
-- 		SET "locationScore" = (
-- 			SELECT ROUND(AVG("commentScore"),1)
-- 			FROM comments
-- 			WHERE "locationID" = NEW."locationID"
-- 		)
-- 		WHERE "locationID" = NEW."locationID";
-- 		return new;
-- 	end;
-- $$
-- language plpgsql;

-- CREATE TRIGGER updateLocationScore_trigger
-- AFTER INSERT ON comments
-- FOR EACH ROW EXECUTE FUNCTION updateLocationScore();

-- DROP TRIGGER updateLocationScore_trigger ON comments;

-- CREATE or Replace Function updateUserCommentCount()
-- returns trigger as
-- $$
-- 	begin
-- 		UPDATE users 
-- 		SET "userCommentCount" = "userCommentCount" + 1
-- 		WHERE "userID" = NEW."userID";
-- 		return new;
-- 	end;
-- $$
-- language plpgsql;

-- CREATE TRIGGER updateUserCommentCount_trigger
-- AFTER INSERT ON comments
-- FOR EACH ROW EXECUTE FUNCTION updateUserCommentCount();
