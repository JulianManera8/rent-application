/* eslint-disable no-unused-vars */
import supabase from '../lib/supabase';

//FUNCION PARA CAPTAR LOS DEPTOS DE CADA USUARIO
export async function getDeptos({ user_id }) {
  const { data, error } = await supabase
    .from("departamentos")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.error(error);
    throw new Error("Falla al cargar todos los deptos");
  }

  return data;
}

//FUNCION PARA ELIMINAR UN DEPTO 
export async function removeDepto({deptoId}) {
  const { error } = await supabase
  .from("departamentos")
  .delete()
  .eq("id", deptoId);

  if (error) {
    console.error(error);
    throw new Error("Unable to load URLs");
  }

  //BORRAR DOCUMENTOS 
  const { filesNames } = await getDocsFromBucket(deptoId);

  if (filesNames.length > 0) {
    const { error: deleteError } = await supabase.storage
      .from('documentos')
      .remove(filesNames.map((name) => `documentos/docs${deptoId}/${name}`));

    if (deleteError) {
      console.error(deleteError.message);
      throw new Error("Error deleting documents");
    }
  }
  
  //BORRAR FOTOS
  const { fotosFilesNames } = await getFotosFromBucket(deptoId);

  if (fotosFilesNames.length > 0) {
    const { error: deleteError } = await supabase.storage
      .from('fotos_depto')
      .remove(fotosFilesNames.map((name) => `fotos_depto/fotos${deptoId}/${name}`));

    if (deleteError) {
      console.error(deleteError.message);
      throw new Error("Error deleting fotos");
    }
  }

  return ' '
}



//FUNCION PARA CREAR DEPTO, INCLUYENDO UPLOAD DOCS Y FOTOS
export async function createDepto({ newDepto }) {
  const { data, error } = await supabase
    .from("departamentos")
    .insert([
      {
        ubicacion_completa: newDepto.ubicacion_completa, 
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
    console.error(error.message);
    throw new Error("Error creating new depto");
  }

  //FUNCION PARA CARGAR LOS DOCS AL BUCKET
  if (data && newDepto.files.length > 0) {
    let idDeptoCreado = data[0].id;

    // Recorre cada archivo en newDepto.files y espera que todos terminen
    await Promise.all(
      newDepto.files.map(async (file) => {
        const filePath = `documentos/docs${idDeptoCreado}/${Date.now()}_${file.name}`;

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
    newDepto.files = [];
  }

  // LLAMA LA FUNCION PARA CAPTAR LOS URL DE LOS DOCS CREADOS
  const { urlDocs: listaDocs } = await getDocsFromBucket(data[0].id);

  // LLAMA LA FUNCION PARA CARGAR ESOS URL A LA TABLA DE DOCS Y ASIGNARLOS AL ID DE CADA DEPTO
  await insertDocs(data[0].id, listaDocs);


  


  //FUNCION PARA CARGAR LAS FOTOS AL BUCKETS
  if (data && newDepto.fotos.length > 0) {
    let idDeptoCreado = data[0].id;

    // Recorre cada archivo en newDepto.files y espera que todos terminen
    await Promise.all(
      newDepto.fotos.map(async (foto) => {
        const filePath = `fotos_depto/fotos${idDeptoCreado}/${Date.now()}_${foto.name}`;

        try {
          const { data: uploadFoto, error: uploadError } = await supabase.storage
            .from("fotos_depto")
            .upload(filePath, foto);

          if (uploadError) {
            console.error(uploadError.message);
            throw new Error("Error uploading the photo");
          }

        } catch (error) {
          alert("Error en la subida de la foto, intenta nuevamente o con otra foto");
        }
      })
    );

    // Limpia el arreglo de archivos después de subir todos
    newDepto.fotos = [];
  }

  // LLAMA LA FUNCION PARA CAPTAR LOS URL DE LOS DOCS CREADOS
  const { urlFotos: listaFotos } = await getFotosFromBucket(data[0].id);

  // LLAMA LA FUNCION PARA CARGAR ESOS URL A LA TABLA DE FOTOS Y ASIGNARLOS AL ID DE CADA DEPTO
  await insertFotos(data[0].id, listaFotos);




  return data; // Retorna los datos del departamento creado
}

// FUNCION PARA CAPTAR LAS URL CREADAS PARA LOS DOCUMENTOS DE CADA DEPTO
async function getDocsFromBucket(idDeptoCreado) {
  const { data: docsBucket, error: errorDocs } = await supabase.storage
    .from('documentos')
    .list('documentos/docs' + idDeptoCreado);

  if (errorDocs) {
    console.error(errorDocs.message);
    throw new Error("Error fetching documents from bucket");
  }

  // Construir las URLs de los documentos
  const urlDocs = docsBucket.map((doc) => {
    return `https://fxvodakyxhuvnopvgvde.supabase.co/storage/v1/object/public/documentos/documentos/docs${idDeptoCreado}/${doc.name}`;
  });

  const filesNames = docsBucket.map((doc) => {
    return doc.name
  })

  return {
    urlDocs,
    filesNames,
  };
}

// FUNCION PARA CAPTAR LAS URL CREADAS PARA LAS FOTOS DE CADA DEPTO
async function getFotosFromBucket(idDeptoCreado) {
  const { data: fotosBucket, error: errorFotos } = await supabase.storage
    .from('fotos_depto')
    .list('fotos_depto/fotos' + idDeptoCreado);

  if (errorFotos) {
    console.error(errorFotos.message);
    throw new Error("Error fetching photos from bucket");
  }

  // Construir las URLs de los documentos
  const urlFotos = fotosBucket.map((foto) => {
    return `https://fxvodakyxhuvnopvgvde.supabase.co/storage/v1/object/public/fotos_depto/fotos_depto/fotos${idDeptoCreado}/${foto.name}`;
  });

  const fotosFilesNames = fotosBucket.map((foto) => {
    return foto.name
  })

  return {
    urlFotos,
    fotosFilesNames,
  };
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

// FUNCION PARA INSERTAR LAS URL DE LOS DOCS EN LA TABLA
async function insertFotos(idDeptoCreado, listaFotos) {
  // Inserta cada URL en la tabla docs_fotos
  await Promise.all(
    listaFotos.map(async (url) => {
      const { data: fotosInserted, error: errorInsertFotos } = await supabase
        .from('fotos_deptos')
        .insert([
          {
            depto_id: idDeptoCreado,
            foto_url: url,
          },
        ]);

      if (errorInsertFotos) {
        console.error(errorInsertFotos.message);
        throw new Error("Error inserting document URLs");
      }

      return fotosInserted;
    })
  );
}

