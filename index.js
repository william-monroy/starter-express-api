const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(
  bodyParser.raw({
    type: "text/javascript",
    limit: "1gb",
  })
);

app.use(cors());

app.get("/", (req, res) => {
  res.send("You are swag");
});

// bodyparsee json
app.use(bodyParser.json());

app.use(function (req, res, next) {
  var allowedOrigins = [
    "http://localhost:3000",
    "https://agenda-arterial.vercel.app/",
  ];
  var origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/export-csv", (req, res) => {
  const body = req.body;
  console.log(req.body);
  let ruta = __dirname + "/reports/reporte.csv";
  let data = body.data;
  switch (body.type) {
    case "Historial Presion Arterial":
      ruta = __dirname + "/reports/mediciones.csv";
      fs.writeFileSync(
        ruta,
        "idPaciente, fecha, hora, estado, presion Sup Promedio, presion Inf Promedio, pulso Promedio, medicamentos\n"
      );
      data.map((item) => {
        fs.appendFileSync(
          ruta,
          `${item.idPaciente}, ${item.fechaLocal}, ${item.estado}, ${item.presionSupPromedio}, ${item.presionInfPromedio}, ${item.pulsoPromedio}, ${item.medicamentos}\n`
        );
      });
      res.download(ruta, (err) => {
        if (err) console.log(err);
        else console.log("Descargado");
      });

      break;
    case "Reportes Semanales":
      ruta = __dirname + `/reports/reportesSemanales.csv`;
      fs.writeFileSync(
        ruta,
        "idPaciente, fecha, hora, seguimiento Dieta, consumo Sal, consumo Refrescos, cantidad Refrescos, actividad Fisica, num Actividad Fisica, horas Descanso, seguimiento Receta, medicamentos\n"
      );
      data.map((item) => {
        fs.appendFileSync(
          ruta,
          `${item.idPaciente}, ${item.fechaLocal}, ${item.seguimientoDieta}, ${item.consumoSal}, ${item.consumoRefrescos}, ${item.cantidadRefrescos}, ${item.actividadFisica}, ${item.numActividadFisica}, ${item.seguimientoReceta},${item.horasDescanso},${item.medicamentos}\n`
        );
      });
      res.download(ruta, (err) => {
        if (err) console.log(err);
      });

      break;
    case "Resportes Salud":
      ruta = __dirname + `/reports/reportesSalud.csv`;
      fs.writeFileSync(
        ruta,
        "idPaciente, fecha, hora, estadoSalud, sintomas Presentes, sintomas, comentarios Adicionales, medicamentos\n"
      );
      data.map((item) => {
        fs.appendFileSync(
          ruta,
          `${item.idPaciente}, ${item.fechaLocal}, ${item.estadoSalud}, ${item.sintomasPresentes}, ${item.sintomas}, ${item.comentariosAdicionales}, ${item.medicamentos}\n`
        );
      });
      // enviar archivo como respuesta
      res.download(ruta, (err) => {
        if (err) console.log(err);
      });
      break;
  }
});

app.post("/export-csv-gen", (req, res) => {
  const body = req.body;
  console.log(body);
  let ruta = __dirname + "/reports";
  let data = body.data;
  switch (body.type) {
    case "Historial Presion Arterial":
      ruta = ruta + "/medicionesGeneral.csv";
      fs.writeFileSync(
        ruta,
        "idPaciente, fecha, hora, estado, presion Sup Promedio, presion Inf Promedio, pulso Promedio\n"
      );
      data.map((item) => {
        fs.appendFileSync(
          ruta,
          `${item.idPaciente}, ${item.fechaLocal}, ${item.estado}, ${item.presionSupPromedio}, ${item.presionInfPromedio}, ${item.pulsoPromedio}\n`
        );
      });
      res.download(ruta, (err) => {
        if (err) console.log(err);
      });

      break;
    case "Reportes Semanales":
      ruta = ruta + "/reportesSemanalesGeneral.csv";
      fs.writeFileSync(
        ruta,
        "idPaciente, fecha, hora, seguimiento Dieta, consumo Sal, consumo Refrescos, cantidad Refrescos, actividad Fisica, num Actividad Fisica, horas Descanso, seguimiento Receta\n"
      );
      data.map((item) => {
        fs.appendFileSync(
          ruta,
          `${item.idPaciente}, ${item.fechaLocal}, ${item.seguimientoDieta}, ${item.consumoSal}, ${item.consumoRefrescos}, ${item.cantidadRefrescos}, ${item.actividadFisica}, ${item.numActividadFisica}, ${item.horasDescanso},${item.seguimientoReceta}\n`
        );
      });
      res.download(ruta, (err) => {
        if (err) console.log(err);
      });
      break;
    case "Resportes Salud":
      ruta = ruta + "/reportesSaludGeneral.csv";
      fs.writeFileSync(
        ruta,
        "idPaciente, fecha, hora, estadoSalud, sintomas Presentes, sintomas, comentarios Adicionales\n"
      );
      data.map((item) => {
        fs.appendFileSync(
          ruta,
          `${item.idPaciente}, ${item.fechaLocal}, ${item.estadoSalud}, ${item.sintomasPresentes}, ${item.sintomas}, ${item.comentariosAdicionales}\n`
        );
      });
      res.download(ruta, (err) => {
        if (err) console.log(err);
      });

      break;
    default:
      break;
  }
});

app.listen(process.env.PORT || 3000);
