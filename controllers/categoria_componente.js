import { categoriaModel } from "../models/categoria_componente.js";

export const categoriaController = {
  obtenerCategorias: async (req, res) => {
    const categorias = await categoriaModel.findAll();

    res.json(categorias);
  },
  obetenerEspecificiones: async (req, res) => {
    const { idcategoria } = req.params;

    const especificaciones = await categoriaModel.findSpecsById(idcategoria);
    res.json(especificaciones)
  },
  validarEspecificaciones: async (req,res, next) => {
    const { idcategoria } = req.body
    const especificaciones = await categoriaModel.findSpecsById(idcategoria);

    const matches = especificaciones?.reduce(
      (value,espec) => value ? !!req.body.especificaciones?.find(e => e.idcat_espec === espec.idcat_espec) : value, true
    )
    if (!matches) return res.status(400).json({ error: "Hacen falta especificaciones para esta categoría" })

    next();
  },
  validarEspecificacionesOpcionales: async (req,res, next) => {
    const { idcategoria } = req.body
    const especificaciones = await categoriaModel.findSpecsById(idcategoria);

    const matches = req.body.especificaciones?.reduce(
      (value,espec) => value ? !!especificaciones?.find(e => e.idcat_espec === espec.idcat_espec) : value, true
    )
    if (!matches) return res.status(400).json({ error: "Alguna espeficicacion no es valida" })
    next();
  }
}