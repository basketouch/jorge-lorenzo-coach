-- Código que se muestra junto al CTA de un curso cuando hay una promoción activa.
alter table cursos
  add column if not exists codigo_promocional text;
