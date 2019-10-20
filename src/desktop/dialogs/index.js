import { FileOpenDialog } from "./FileOpenDialog";
import { FileSaveDialog } from "./FileSaveDialog";
import { PromptDialog } from "./PromptDialog";
import { AppAboutDialog } from "./AppAboutDialog";
import { LauncherDialog } from "./LauncherDialog";

export const dialogs = {
  'file-open': FileOpenDialog,
  'file-save': FileSaveDialog,
  'prompt': PromptDialog,
  'app-about': AppAboutDialog,
  'launcher': LauncherDialog
}