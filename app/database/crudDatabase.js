/* eslint-disable no-unused-vars */
import supabase from '../lib/supabase';

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
  
    if (data && objPrueba.files.length > 0) {
        let idDeptoCreado = data[0].id;
    
        // Recorre cada archivo en objPrueba.files
        for (let file of objPrueba.files) {
            const filePath = `documentos/doc${idDeptoCreado}/${Date.now()}_${file.name}`;
    
            try {
                const { data: uploadData, error: uploadError } = await supabase.storage
                  .from("documentos")
                  .upload(filePath, file);
    
                if (uploadError) {
                    console.error(uploadError.message);
                    throw new Error("Error uploading the file");
                }
    
                console.log("Archivo subido:", uploadData);
            } catch (error) {
                console.error("Error en la subida del archivo", error);
            }
        }

        objPrueba.files = [];

    }
  
    return data; // Retorna los datos del departamento creado
}