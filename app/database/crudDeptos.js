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

export async function getDeptoById(id) {
  const { data, error } = await supabase
    .from("departamentos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Falla al cargar el departamento");
  }

  return data;
}

//FUNCION PARA ELIMINAR UN DEPTO 
export async function removeDepto(deptoId) {
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
        grupo_id: newDepto.grupo_id,
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
        const filePath = `documentos/docs${idDeptoCreado}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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

  }

  // LLAMA LA FUNCION PARA CAPTAR LOS URL DE LOS DOCS CREADOS
  const { urlDocs: listaDocs } = await getDocsFromBucket(data[0].id);

  // LLAMA LA FUNCION PARA CARGAR ESOS URL A LA TABLA DE DOCS Y ASIGNARLOS AL ID DE CADA DEPTO
  await insertDocs(data[0].id, listaDocs, newDepto.files);
  newDepto.files = [];

  


  //FUNCION PARA CARGAR LAS FOTOS AL BUCKETS
  if (data && newDepto.fotos.length > 0) {
    let idDeptoCreado = data[0].id;
  
    // Recorre cada archivo en newDepto.files y espera que todos terminen
    await Promise.all(
      newDepto.fotos.map(async (foto) => {
        // Generate a unique file path for each file
        const filePath = `fotos_depto/fotos${idDeptoCreado}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
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
export async function getDocsFromBucket(idDeptoCreado) {
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
export async function getFotosFromBucket(idDeptoCreado) {
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
async function insertDocs(idDeptoCreado, listaDocs, files) {
  // Inserta cada URL en la tabla docs_deptos con su nombre correspondiente
  await Promise.all(
    listaDocs.map(async (url, index) => {
      const { data: docsInserted, error: errorInsertDocs } = await supabase
        .from('docs_deptos')
        .insert([
          {
            depto_id: idDeptoCreado,
            doc_url: url,
            doc_name: files[index].name,
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

export async function editDepto(idDepto, editedInfoDepto) {
  try {
    const { data, error } = await supabase
      .from('departamentos')
      .update(
        {
          ubicacion_completa: editedInfoDepto.ubicacion_completa, 
          descripcion: editedInfoDepto.descripcion, 
          ocupado: editedInfoDepto.ocupado, 
          propietario_name: editedInfoDepto.propietario_name, 
          locador_name: editedInfoDepto.locador_name, 
          inquilino_name: editedInfoDepto.inquilino_name, 
          cobrador_name: editedInfoDepto.cobrador_name, 
          facturador_name: editedInfoDepto.facturador_name, 
          usufructuario_name: editedInfoDepto.usufructuario_name, 
          metodo_cobro: editedInfoDepto.metodo_cobro, 
          vencimiento_contrato: editedInfoDepto.vencimiento_contrato, 
          inscripto_reli: editedInfoDepto.inscripto_reli, 
          vencimiento_usufructo: editedInfoDepto.vencimiento_usufructo, 
          monto_cobro: editedInfoDepto.monto_cobro, 
          monto_cobro_inicio: editedInfoDepto.monto_cobro_inicio, 
          fecha_actualizacion_cobro: editedInfoDepto.fecha_actualizacion_cobro, 
          obs_datos: editedInfoDepto.obs_datos, 
        },
      )
      .eq('id', idDepto)
      .select()

    if (error) {
        console.error("Error en la update:", error.message);
        throw new Error(error.message);
    }

    console.log("Departamento Actualizado:", data);
    return data;

  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function removeDocument( docPath ) {

  try {
    const { error } = await supabase
      .from("docs_deptos")
      .delete()
      .eq("doc_url", docPath);

    if (error) {
      console.error(error);
      return error
    }

    // 2. Eliminar el archivo del bucket de Supabase
    const { error: storageError } = await supabase.storage
      .from("documentos")
      .remove([docPath]); 

    if (storageError) {
      console.error("Error al eliminar el archivo del bucket:", storageError.message);
      throw new Error("Error deleting the file from storage");
    }

    return true;

  } catch (storageError) {
    console.error(storageError.message);
  }
  
}


export async function insertNewDoc({ file, depto_id }) {
  try {
    // Create a unique file path
    const filePath = `documentos/docs${depto_id}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Upload the file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("documentos")
      .upload(filePath, file)

    if (uploadError) {
      console.error("Error uploading file:", uploadError.message)
      throw new Error("Error al subir el archivo")
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from("documentos")
      .getPublicUrl(filePath)

    // Insert the document record
    const { data: docData, error: insertError } = await supabase
      .from('docs_deptos')
      .insert([
        {
          depto_id,
          doc_url: publicUrl,
          doc_name: file.name,
        },
      ])
      .select()
      .single()

    if (insertError) {
      console.error("Error inserting document record:", insertError.message)
      // If insert fails, try to delete the uploaded file
      await supabase.storage.from("documentos").remove([filePath])
      throw new Error("Error al guardar la información del documento")
    }

    return docData
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("Error inesperado al procesar el documento")
  }
}


export async function insertNewImage({ file, depto_id }) {
  try {
    const filePath = `fotos_depto/fotos${depto_id}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("fotos_depto")
      .upload(filePath, file)

    if (uploadError) {
      console.error("Error uploading image:", uploadError.message)
      throw new Error("Error al subir la imagen")
    }

    const { data: { publicUrl } } = supabase.storage
      .from("fotos_depto")
      .getPublicUrl(filePath)

    const { data: imageData, error: insertError } = await supabase
      .from('fotos_deptos')
      .insert([
        {
          depto_id,
          foto_url: publicUrl,
        },
      ])
      .select()
      .single()

    if (insertError) {
      console.error("Error inserting image record:", insertError.message)
      await supabase.storage.from("fotos_deptos").remove([filePath])
      throw new Error("Error al guardar la información de la imagen")
    }

    return imageData
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("Error inesperado al procesar la imagen")
  }
}

export async function removeImage( imgPath ) {

  try {
    const { error } = await supabase
      .from("fotos_deptos")
      .delete()
      .eq("foto_url", imgPath);

    if (error) {
      console.error(error);
      return error
    }

    // 2. Eliminar el archivo del bucket de Supabase
    const { error: storageError } = await supabase.storage
      .from("fotos_depto")
      .remove([imgPath]); 

    if (storageError) {
      console.error("Error al eliminar el archivo del bucket:", storageError.message);
      throw new Error("Error deleting the file from storage");
    }

    return true;

  } catch (storageError) {
    console.error(storageError.message);
  }
  
}
