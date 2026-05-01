import { CloudSandboxApiName } from '../../types';
import { EditLocalFileInspector } from './EditLocalFile';
import { ExecuteCodeInspector } from './ExecuteCode';
import { GlobLocalFilesInspector } from './GlobLocalFiles';
import { GrepContentInspector } from './GrepContent';
import { ListLocalFilesInspector } from './ListLocalFiles';
import { ReadLocalFileInspector } from './ReadLocalFile';
import { RunCommandInspector } from './RunCommand';
import { SearchLocalFilesInspector } from './SearchLocalFiles';
import { WriteLocalFileInspector } from './WriteLocalFile';

/**
 * Code Interpreter Inspector Components Registry
 *
 * Each component is also registered under the legacy long API name so old DB
 * messages with apiName like 'readLocalFile' still render after the rename.
 */
export const CloudSandboxInspectors = {
  [CloudSandboxApiName.editFile]: EditLocalFileInspector,
  [CloudSandboxApiName.executeCode]: ExecuteCodeInspector,
  [CloudSandboxApiName.globFiles]: GlobLocalFilesInspector,
  [CloudSandboxApiName.grepContent]: GrepContentInspector,
  [CloudSandboxApiName.listFiles]: ListLocalFilesInspector,
  [CloudSandboxApiName.readFile]: ReadLocalFileInspector,
  [CloudSandboxApiName.runCommand]: RunCommandInspector,
  [CloudSandboxApiName.searchFiles]: SearchLocalFilesInspector,
  [CloudSandboxApiName.writeFile]: WriteLocalFileInspector,
  // Legacy aliases — keep these so historical messages keep rendering
  editLocalFile: EditLocalFileInspector,
  globLocalFiles: GlobLocalFilesInspector,
  listLocalFiles: ListLocalFilesInspector,
  readLocalFile: ReadLocalFileInspector,
  searchLocalFiles: SearchLocalFilesInspector,
  writeLocalFile: WriteLocalFileInspector,
};
