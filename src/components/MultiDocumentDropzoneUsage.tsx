'use client';
import {
  MultiFileDropzone,
  type FileState,
} from '@/components/MultiFileDropzone';
import { useEdgeStore } from '@/lib/edgestore';
import { AimlFileUploadRequest } from '@/lib/validators/AimlFileUploadValidator';
import { DocumentUploadRequest } from '@/lib/validators/DocumentUploadValidator';
import { User } from '@prisma/client';
import axios from 'axios';
import { useState } from 'react';

type Props = {
  classroomId: string,
  subjectId: string,
  userName : string
}

export function MultiDocumentDropzoneUsage({classroomId,subjectId , userName}: Props) {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();

  function updateFileProgress(key: string, progress: FileState['progress']) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key,
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  return (
    <div>
      <MultiFileDropzone
        value={fileStates}
        onChange={(files) => {
          setFileStates(files);
        }}
        onFilesAdded={async (addedFiles) => {
          setFileStates([...fileStates, ...addedFiles]);
          await Promise.all(
            addedFiles.map(async (addedFileState) => {
              try {
                const res = await edgestore.publicFiles.upload({
                  file: addedFileState.file,
                  onProgressChange: async (progress) => {
                    updateFileProgress(addedFileState.key, progress);
                    if (progress === 100) {
                      // wait 1 second to set it to complete
                      // so that the user can see the progress bar at 100%
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      updateFileProgress(addedFileState.key, 'COMPLETE');
                    }
                  },
                });
                const payload : DocumentUploadRequest = {
                  fileUrl : res.url,
                  fileSize : res.size,
                  classroomId : classroomId,
                  subjectId : subjectId,
                  uploadedBy : userName,
                  uploadedAt : res.uploadedAt.toISOString(),
                  name : addedFiles[0].file.name,
                  id : addedFiles[0].key
                }

                await axios.post(`/api/subject/${subjectId}`, payload)
                console.log(res);
              } catch (err) {
                console.log(err);
                updateFileProgress(addedFileState.key, 'ERROR');
              }
            }),
          );
        }}
      />
    </div>
  );
}

