import prisma from "../utils/prisma";

export const createIncidentService = async (
  data: any,
  files: Express.Multer.File[]
) => {

  const incident = await prisma.incident.create({

    data: {
      title: data.title,
      description: data.description,
      severity: data.severity,
      category: data.category,
      location: data.location,
      status: "OPEN",

      departmentId: Number(data.departmentId),
      reporterId: 2,

    }

  });


  if(files && files.length > 0){

    await prisma.incidentAttachment.createMany({

      data: files.map((file)=>({

        fileName: file.originalname,
        filePath: file.path,
        fileType: file.mimetype,

        incidentId: incident.id

      }))

    });

  }


  return incident;

};