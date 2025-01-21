import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    await this.db
      .rawQuery(
        `
      CREATE OR REPLACE FUNCTION public.notify_cell_change()
      RETURNS trigger
      LANGUAGE plpgsql
      AS $function$
      DECLARE
        payload json;
      BEGIN
        SELECT json_build_object(
          'operation', TG_OP,
          'data', (
            SELECT row_to_json(cell_data) FROM (
              SELECT
                NEW.id,
                NEW.branch_id "branchId",
                NEW.title,
                NEW.type,
                NEW.content,
                NEW.tags,
                NEW.created_at as "createdAt",
                (
                SELECT row_to_json(media_json)
                FROM (
          SELECT
            m.id,
            m.cell_id as "cellId",
            m.width,
            m.height,
            m.file_size as "fileSize",
            m.mime,
            m.original_url as "originalUrl",
            m.resized_url as "resizedUrl",
            m.blur_url as "blurUrl",
            m.thumbnail_url as "thumbnailUrl",
            m.duration
          FROM media m
          WHERE m.cell_id = NEW.id
              ) media_json
            ) as media
            ) cell_data
          )
        ) INTO payload;

        PERFORM pg_notify('cell_changes', payload::text);
      RETURN NEW;
      END;
      $function$
    `
      )
      .exec()

    await this.db
      .rawQuery(
        `
      CREATE OR REPLACE FUNCTION public.notify_cell_deletion()
      RETURNS trigger
      LANGUAGE plpgsql
      AS $function$
      DECLARE
        payload json;
      BEGIN
        SELECT json_build_object(
          'operation', TG_OP,
          'data', (
            SELECT row_to_json(cell_data) FROM (
              SELECT
                OLD.id,
                OLD.branch_id as "branchId",
                OLD.title,
                OLD.type,
                OLD.content,
                OLD.tags,
                OLD.created_at as "createdAt",
                (
                SELECT row_to_json(media_json)
                FROM (
          SELECT
            m.id,
            m.cell_id as "cellId",
            m.width,
            m.height,
            m.file_size as "fileSize",
            m.mime,
            m.original_url as "originalUrl",
            m.resized_url as "resizedUrl",
            m.blur_url as "blurUrl",
            m.thumbnail_url as "thumbnailUrl",
            m.duration
          FROM media m
          WHERE m.cell_id = OLD.id
              ) media_json
            ) as media
            ) cell_data
          )
        ) INTO payload;

        PERFORM pg_notify('cell_deletion', payload::text);
      RETURN OLD;
      END;
      $function$
    `
      )
      .exec()

    await this.db
      .rawQuery(
        `
      CREATE TRIGGER notify_cell_change_trigger
        AFTER INSERT OR UPDATE ON cells
        FOR EACH ROW EXECUTE FUNCTION notify_cell_change();
    `
      )
      .exec()

    await this.db
      .rawQuery(
        `
      CREATE TRIGGER notify_cell_deletion_trigger
        AFTER DELETE ON cells
        FOR EACH ROW EXECUTE FUNCTION notify_cell_deletion();
    `
      )
      .exec()
  }

  async down() {
    await this.db.rawQuery('DROP TRIGGER IF EXISTS notify_cell_change_trigger ON cells;').exec()
    await this.db.rawQuery('DROP FUNCTION IF EXISTS notify_cell_change;').exec()
    await this.db.rawQuery('DROP TRIGGER IF EXISTS notify_cell_deletion_trigger ON cells;').exec()
    await this.db.rawQuery('DROP FUNCTION IF EXISTS notify_cell_deletion;').exec()
  }
}
