import { Router } from "express"
import { ticketController } from "../controllers/ticket.js";
import { checkValidator, extraerUsuario, gestionarUsuario, verificarRol } from "../middlewares.js";
import { rolesUsuario, usuarioController } from "../controllers/usuario.js";
import { UUIDParamValidator } from "../validators/general_validators.js";
import { ticketEmailValidator, ticketNuevoValidator, ticketProcessValidator } from "../validators/ticket_validator.js";
import { notificacionController } from "../controllers/notificacion.js";

const ticketRouter = Router();
ticketRouter.post("/",
  extraerUsuario,
  verificarRol([rolesUsuario.CLIENTE]),
  ticketNuevoValidator,
  checkValidator,
  ticketController.crearTicketUsuario,
  notificacionController.notificar
);

ticketRouter.post("/email",
  ticketEmailValidator,
  ticketNuevoValidator,
  checkValidator,
  usuarioController.validarEmailCliente,
  ticketController.crearTicketEmail,
  notificacionController.notificar
);

ticketRouter.get("/",
  extraerUsuario,
  verificarRol([rolesUsuario.CLIENTE]),
  ticketController.obtenerTicketsUsuario
);

ticketRouter.get("/servicios",
  ticketController.obtenerTiposServicio
);

ticketRouter.post("/servicios",
  extraerUsuario,
  verificarRol([rolesUsuario.ADMIN]),
  ticketController.agregarTipoServicio
);

ticketRouter.get("/gestionar",
  extraerUsuario,
  verificarRol([rolesUsuario.ADMIN, rolesUsuario.EMPLEADO]),
  ticketController.obtenerTickets
);

ticketRouter.get("/gestionar/:idticket",
  extraerUsuario,
  verificarRol([rolesUsuario.ADMIN, rolesUsuario.EMPLEADO]),
  UUIDParamValidator("idticket"),
  checkValidator,
  ticketController.obtenerTicket
);
ticketRouter.get("/:idticket",
  extraerUsuario,
  verificarRol([rolesUsuario.CLIENTE]),
  UUIDParamValidator("idticket"),
  checkValidator,
  ticketController.obtenerTicketUsuario
);


ticketRouter.put("/aceptar/:idticket",
  extraerUsuario,
  verificarRol([rolesUsuario.EMPLEADO]),
  UUIDParamValidator("idticket"),
  checkValidator,
  // ticketController.validarNoAceptado,
  ticketController.asignarEmpleado,
  notificacionController.notificar
);

ticketRouter.put("/gestionar/:idticket",
  extraerUsuario,
  verificarRol([rolesUsuario.ADMIN, rolesUsuario.EMPLEADO]),
  UUIDParamValidator("idticket"),
  ticketProcessValidator,
  checkValidator,
  ticketController.gestionarTicket,
  
);



ticketRouter.get("/gestionar/:idusuario",
  extraerUsuario,
  verificarRol([rolesUsuario.ADMIN, rolesUsuario.EMPLEADO]),
  UUIDParamValidator("idusuario"),
  checkValidator,
  gestionarUsuario(rolesUsuario.CLIENTE),
  ticketController.obtenerTicketsUsuario
);

// ticketRouter.put("/:idticket", ticketController.actualizarTicket);
// ticketRouter.delete("/ticket/:idticket", ticketController.eliminarTicket);

export default ticketRouter;