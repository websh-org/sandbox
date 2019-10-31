import React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";
import logo from "~/../static/web-shell-logo.png"
import { DataList } from "~/desktop/ui";
@observer
export class AboutShell extends React.Component {
  manifest = {
    v:0,
    name: "About WebShell",
    icon: "icon.png",
    description: "About WebShell"
  }
  render() {
    return (
      <div className="ui container segments">
        <div className="ui segment ">
          <div className="ui divided grid">
            <div className="two columns row">
              <div className="middle aligned column">
                <img className="ui small image" src={logo} style={{ margin: "0 auto" }} />
                <div className="ui center aligned huge header">
                  <h1>WebShell 0.2</h1>
                  <div className="sub header">
                    The Development Sandbox edition
                  </div>
                </div>
              </div>
              <div className="column">
                <div className="ui center aligned header">
                  WebShell is under development.
                </div>
                <p>
                  WebShell is an <b>open-source online desktop</b> environment. It allows <b>easy integration</b> of
                  single-page web apps and provides them with <b>file menu</b> operations and
                  the required <b>user interface</b>.
                </p>
                <p>
                  WebShell provides a <b>consistent user experience</b> for all apps,
                  while freeing the app developer from <b>great amounts of work</b>.
                </p>
                <p>
                  For now, files can be opened and saved from the local computer. In the
                  future, users will be able to connect to their files on cloud services.
                  This will allow them to use WebShell apps with their files without giving
                  apps the permission to access their file storage.
                </p>
                <p>
                  Read more about WebShell at <a target="_blank" href="http://websh.org/about">the project website</a>.
                </p>
                <p>
                  Refer to App API specs in <a target="_blank" href="http://websh.org/api">the docs</a>.
                </p>
                <p>
                  See the code on <a target="_blank" href="http://github.com/websh-org/">GitHub</a>.
                </p>
                <small>
                  This project is funded through the NGI0 PET Fund, a fund established by NLnet
                  with financial support from the European Commission’s Next Generation Internet
                  programme, under the aegis of DG Communications Networks, Content and Technology
                  under grant agreement No 825310. Applications are still open, you can apply today.
                </small>
              </div>
            </div>
          </div>
        </div>
        <div className="ui padded segment">
          <div className="ui very relaxed divided grid">
            <div className="three columns row">
              <div className="column">
                <div className="ui center aligned grey large header ">
                  For Users
                </div>
                <div className="ui center aligned green header">
                  Try Now
                    </div>
                <DataList className="bulleted" data={[
                  "Click the WebShell launcher button and try out the example apps.",
                  "Open and save your local files with any WebShell app.",
                ]} />
                <div className="ui center aligned green small header">
                  Under Development
                  </div>
                <DataList className="bulleted" data={[
                  "Manage connections to your files at non-commercial and commercial cloud services.",
                  "Access your files from anywhere in a unified file manager.",
                  "Open and save your files with any WebShell app, without giving the app.",
                  "Store your settings in the cloud, so you can use your desktop anywhere.",
                  "Use your apps in a full-featured desktop environment."
                ]} />
              </div>
              <div className="column">
                <div className="ui center aligned grey large header">
                  For App Developers
                  </div>
                <div className="ui center aligned blue header">
                  Try Now
                  </div>
                <div className="ui bulleted list ">
                  <div className="item">
                    Use our <a href="https://github.com/websh-org/template-app-vanilla">Vanilla JS
                  </a> or <a href="https://github.com/websh-org/template-app-parcel">Parecl Enabled
                  </a> starter projects to kick-start your app.
                  <DataList className="" data={[
                      "Integrate your single page app with WebShell in minutes.",
                      "Allow your users to open and save files using the WebShell app API.",
                      "No need to worry about coding file operations or implementing the UI, they are provided by WebShell.",
                    ]} />

                  </div>
                </div>
                <div className="ui center aligned small blue header">
                  Under development
                  </div>
                <div className="ui bulleted list ">
                  <div className="item">
                    Give your users access to their files on cloud services <i>without doing anything:</i>
                    <DataList className="" data={[
                      "No cloud APIs to learn",
                      "No API keys to generate",
                      "No login or registration process to handle",
                      "No secrets or tokens to store securely",
                      "No need to know where files are stored",
                      "No UI to design and implement",
                      "Everything is handled by WebShell",
                    ]} />
                  </div>
                  <div className="item">
                    Take advantage of other WebShell app APIs:
                      <DataList className="" data={[
                      "UI and storage for your app's settings",
                      "Drop down menus and toolbars for your app",
                      "...",
                    ]} />
                  </div>
                </div>
              </div>
              <div className="column">
                <div className="ui grey center aligned large header">
                  Project Milestones
                  </div>
                <div className="ui center aligned small header">
                  0.2.x
                  </div>
                <DataList className="bulleted" data={[
                  "DONE Finalize file API manifest schema",
                  "DONE Update documentation on websh.org",
                  "DONE Build starter app template repos on github",
                  "DONE Provide human readable messages for all errors",
                  "Allow reloading a failed window instead of instant closing",
                ]} />
                <div className="ui center aligned small header">
                  0.3
                  </div>
                <DataList className="bulleted" data={[
                  "Core: Secure message channel with JWT",
                  "FS API: FS Adapter Manifest",
                  "FS API: List / Info / Read / Write",
                  "File Manager: File Dialogs",
                  "FS Adapter: Solid Storage Files",
                  "File Manager: Integrate FS and File Dialogs",
                ]} />
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

