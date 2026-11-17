-- Permite ocultar la oferta y los importes de Skool sin eliminar el enlace a la Comunidad.
alter table cursos
  add column if not exists ocultar_precios_skool boolean not null default false;
