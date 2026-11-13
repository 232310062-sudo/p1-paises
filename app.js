async function buscarPais(nombre) {
  const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(nombre)}?fields=name,translations,capital,region,population,flags`;
  const respuesta = await fetch(url);

  if (respuesta.status === 404) {
    throw new Error("No se encontró ningún país con ese nombre.");
  }

  if (!respuesta.ok) {
    throw new Error(`Error del servidor (código ${respuesta.status}).`);
  }

  const datos = await respuesta.json();
  if (!Array.isArray(datos) || datos.length === 0 || !datos[0].name) {
    throw new Error("La API no devolvió datos válidos de países en esta red.");
  }

  return datos;
}

function mostrarPaises(paises) {
  const contenedor = document.getElementById("resultados");
  contenedor.innerHTML = "";

  paises.forEach(pais => {
    const nombrePais = pais.translations?.spa?.common || pais.name?.common || "Sin nombre";
    const bandera = pais.flags?.png || "";
    const capital = Array.isArray(pais.capital) ? pais.capital[0] : (pais.capital || "Sin capital");

    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";
    tarjeta.innerHTML = `
      <img src="${bandera}" alt="Bandera de ${nombrePais}">
      <h3>${nombrePais}</h3>
      <p><b>Capital:</b> ${capital}</p>
      <p><b>Región:</b> ${pais.region || "N/A"}</p>
      <p><b>Población:</b> ${(pais.population || 0).toLocaleString("es-MX")}</p>
    `;
    contenedor.appendChild(tarjeta);
  });
}

const form = document.getElementById("formBuscar");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("txtPais").value.trim();
  mensaje.textContent = "Cargando...";

  try {
    const paises = await buscarPais(nombre);
    mostrarPaises(paises);
    mensaje.textContent = `${paises.length} resultado(s)`;
  } catch (error) {
    document.getElementById("resultados").innerHTML = "";
    mensaje.textContent = error.message;
  }
});
