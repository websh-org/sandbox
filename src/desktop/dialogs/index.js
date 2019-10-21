import { FileOpenDialog } from "./FileOpenDialog";
import { FileSaveDialog } from "./FileSaveDialog";
import { PromptDialog } from "./PromptDialog";
import { AppAboutDialog } from "./AppAboutDialog";
import { LauncherDialog } from "./LauncherDialog";
import { FileUnsavedDialog } from "./FileUnsavedDialog";
import { ErrorDialog } from "./ErrorDialog";

export const dialogs = {
  'file-unsaved': FileUnsavedDialog,
  'file-open': FileOpenDialog,
  'file-save': FileSaveDialog,
  'prompt': PromptDialog,
  'app-about': AppAboutDialog,
  'launcher': LauncherDialog,
  'error': ErrorDialog
}