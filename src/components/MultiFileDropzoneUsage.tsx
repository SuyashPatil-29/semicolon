'use client';
import {
  MultiFileDropzone,
  type FileState,
} from '@/components/MultiFileDropzone';
import { useEdgeStore } from '@/lib/edgestore';
import { AimlFileUploadRequest } from '@/lib/validators/AimlFileUploadValidator';
import { User } from '@prisma/client';
import axios from 'axios';
import { useState } from 'react';

type Props = {
  user : Pick<User, "name" | "id" | "usn" | "access">
}

export function MultiFileDropzoneUsage({user}: Props) {
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
                const payload : AimlFileUploadRequest = {
                  fileUrl : res.url,
                  fileSize : res.size,
                  userId : user.id,
                  uploadedBy : user.name,
                  uploadedAt : res.uploadedAt.toISOString(),
                  name : addedFiles[0].file.name
                }
                await axios.post("/api/aiml-library", payload)
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
