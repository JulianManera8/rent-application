/* eslint-disable no-unused-vars */
import supabase from '../lib/supabase';

//FUNCION PARA CAPTAR LOS DEPTOS DE CADA USUARIO
export async function getDeptos({user_id}) {
    const { data, error } = await supabase
    .from('departamentos')
    .select('*')
    .eq("user_id", user_id);

    if(error) {
        console.error(error);
        throw new Error('Falla al cargar todos los deptos');
    }

    return data;
}

//FUNCION PARA CREAR DEPTO, INCLUYENDO UPLOAD DOCS Y FOTOS
export async function createDepto({ newDepto }) {
    const { data, error } = await supabase
      .from("departamentos")
      .insert([
        {
          ubicacion: newDepto.ubicacion,
          descripcion: newDepto.descripcion,
          ocupado: newDepto.ocupado,
          propietario_name: newDepto.propietario_name,
          locador_name: newDepto.locador_name,
          inquilino_name: newDepto.inquilino_name,
          cobrador_name: newDepto.cobrador_name,
          facturador_name: newDepto.facturador_name,
          usufructuario_name: newDepto.usufructuario_name,
          metodo_cobro: newDepto.metodo_cobro,
          vencimiento_contrato: newDepto.vencimiento_contrato,
          inscripto_reli: newDepto.inscripto_reli,
          vencimiento_usufructo: newDepto.vencimiento_usufructo,
          monto_cobro: newDepto.monto_cobro,
          monto_cobro_inicio: newDepto.monto_cobro_inicio,
          fecha_actualizacion_cobro: newDepto.fecha_actualizacion_cobro,
          user_id: newDepto.user_id,
          obs_datos: newDepto.obs_datos,
        },
      ])
      .select();
  
    if (error) {
        console.error(error.message)
        throw new Error("Error creating new depto");
    }
    console.log('data');
    return data;
}

//FUNCION PARA CREAR DEPTO, INCLUYENDO UPLOAD DOCS Y FOTOS
export async function createPrueba({ objPrueba }) {
  const { data, error } = await supabase
    .from("departamentos")
    .insert([
      {
        ubicacion_completa: objPrueba.ubicacion_completa,
        user_id: objPrueba.user_id,
      },
    ])
    .select();

  if (error) {
    console.error(error.message);
    throw new Error("Error creating new prueba");
  }

  //FUNCION PARA CARGAR LOS DOCS AL BUCKET
  if (data && objPrueba.files.length > 0) {
    let idDeptoCreado = data[0].id;

    // Recorre cada archivo en objPrueba.files y espera que todos terminen
    await Promise.all(
      objPrueba.files.map(async (file) => {
        const filePath = `documentos/doc${idDeptoCreado}/${Date.now()}_${file.name}`;

        try {
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("documentos")
            .upload(filePath, file);

          if (uploadError) {
            console.error(uploadError.message);
            throw new Error("Error uploading the file");
          }

        } catch (error) {
          alert("Error en la subida del archivo, intenta nuevamente o con otro archivo", error);
        }
      })
    );

    // Limpia el arreglo de archivos después de subir todos
    objPrueba.files = [];
  }

  // LLAMA LA FUNCION PARA CAPTAR LOS URL DE LOS DOCS CREADOS
  const listaDocs = await getDocsFromBucket(data[0].id);

  // LLAMA LA FUNCION PARA CARGAR ESOS URL A LA TABLA DE DOCS Y ASIGNARLOS AL ID DE CADA DEPTO
  await insertDocs(data[0].id, listaDocs);

  return data; // Retorna los datos del departamento creado
}

// FUNCION PARA CAPTAR LAS URL CREADAS PARA LOS DOCUMENTOS DE CADA DEPTO
async function getDocsFromBucket(idDeptoCreado) {
  const { data: docsBucket, error: errorDocs } = await supabase.storage
    .from('documentos')
    .list('documentos/doc' + idDeptoCreado);

  if (errorDocs) {
    console.error(errorDocs.message);
    throw new Error("Error fetching documents from bucket");
  }

  // Construir las URLs de los documentos
  const urlDocs = docsBucket.map((doc) => {
    return `https://fxvodakyxhuvnopvgvde.supabase.co/storage/v1/object/public/documentos/documentos/doc${idDeptoCreado}/${doc.name}`;
  });

  return urlDocs;
}

// FUNCION PARA INSERTAR LAS URL DE LOS DOCS EN LA TABLA
async function insertDocs(idDeptoCreado, listaDocs) {
  // Inserta cada URL en la tabla docs_deptos
  await Promise.all(
    listaDocs.map(async (url) => {
      const { data: docsInserted, error: errorInsertDocs } = await supabase
        .from('docs_deptos')
        .insert([
          {
            depto_id: idDeptoCreado,
            doc_url: url,
          },
        ]);

      if (errorInsertDocs) {
        console.error(errorInsertDocs.message);
        throw new Error("Error inserting document URLs");
      }

      return docsInserted;
    })
  );
}

