// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using HutongGames.PlayMakerEditor;
using UnityEditor;
using UnityEngine;

// You can't open an EditorWindow class in a C# Dll (as far as I can tell)
// So we use a wrapper script to create the window and hook the editor up
// TODO: move this to dll when Unity supports it...

[System.Serializable]
class FsmEditorWindow : EditorWindow
{
	[SerializeField]
	FsmEditor fsmEditor;
	
	// tool windows (can't open them inside dll)
	[SerializeField] FsmSelectorWindow fsmSelectorWindow;
	[SerializeField] FsmTemplateWindow fsmTemplateWindow;
	[SerializeField] FsmStateWindow stateSelectorWindow;
	[SerializeField] FsmActionWindow actionWindow;
	[SerializeField] FsmErrorWindow errorWindow;
	[SerializeField] FsmLogWindow logWindow;
	[SerializeField] ContextToolWindow toolWindow;
	[SerializeField] AboutWindow aboutWindow;

	[MenuItem("PlayMaker/Open PlayMaker FSM Editor")]
	public static void OpenWindow()
	{
		var window = GetWindow<FsmEditorWindow>();
		window.fsmEditor.OnSelectionChange();
	}
	
	[MenuItem("PlayMaker/Add PlayMakerGUI to Scene", true)]
	public static bool ValidateAddPlayMakerGUI()
	{
		return (GameObject.FindObjectOfType(typeof(PlayMakerGUI)) as PlayMakerGUI) == null;
	}

	[MenuItem("PlayMaker/Add PlayMakerGUI to Scene")]
	public static void AddPlayMakerGUI()
	{
		PlayMakerGUI.Instance.enabled = true;
	}
	
	[MenuItem("PlayMaker/Add FSM To Selected", true)]
	public static bool ValidateAddFsmToSelected()
	{
		return Selection.activeGameObject != null;
	}

	[MenuItem("PlayMaker/Add FSM To Selected")]
	public static void AddFsmToSelected()
	{
		FsmBuilder.AddFsmToSelected();
		//PlayMakerFSM playmakerFSM = Selection.activeGameObject.AddComponent<PlayMakerFSM>();
		//FsmEditor.SelectFsm(playmakerFSM.Fsm);
	}
	
/*	[MenuItem("PlayMaker/Copy FSM To Selected", true)]
	public static bool ValidateCopyFsmToSelected()
	{
		return (Selection.activeGameObject != null &&
		        FsmEditor.SelectedFsm != null);
	}

	[MenuItem("PlayMaker/Copy FSM To Selected")]
	public static void CopyFsmToSelected()
	{
		FsmBuilder.CopyFsmToSelected(FsmEditor.SelectedFsm);
	}
	
	[MenuItem("PlayMaker/Add Template To Selected", true)]
	public static bool ValidateAddTemplateToSelected()
	{
		return (Selection.activeGameObject != null &&
		        FsmEditor.SelectedTemplate != null);
	}

	[MenuItem("PlayMaker/Add Template To Selected")]
	public static void AddTemplateToSelected()
	{
		FsmBuilder.AddTemplateToSelected(FsmEditor.SelectedTemplate);
	}
*/	
	[MenuItem("PlayMaker/Online Manual")]
	public static void OnlineManual()
	{
		EditorCommands.OpenWikiHelp();
		//Application.OpenURL("https://hutonggames.fogbugz.com/default.asp?W1");
	}

	[MenuItem("PlayMaker/Video Tutorials")]
	public static void VideoTutorials()
	{
		Application.OpenURL("http://www.screencast.com/users/HutongGames/folders/PlayMaker");
	}

	
/*	[MenuItem("PlayMaker/Release Notes")]
	public static void ReleaseNotes()
	{
		EditorCommands.OpenWikiPage(WikiPages.ReleaseNotes);
		//Application.OpenURL("https://hutonggames.fogbugz.com/default.asp?W311");
	}*/

	[MenuItem("PlayMaker/About PlayMaker...")]
	public static void OpenAboutWindow()
	{
		GetWindow<AboutWindow>();
	}

	public void OnEnable()
	{
		FsmEditorHelpers.BuildFsmList();

		fsmEditor = new FsmEditor();
		fsmEditor.InitWindow(this);
		fsmEditor.OnEnable();
	}
	
	public void OnGUI()
	{
		fsmEditor.OnGUI();
		
/*		BeginWindows();
		
		fsmEditor.DoPopupWindows();
		
		EndWindows();*/
		
		if (Event.current.type == EventType.ValidateCommand)
    	{
			//Debug.Log(Event.current.commandName);

			switch (Event.current.commandName)
			{
				case "UndoRedoPerformed":
					FsmEditor.UndoRedoPerformed();
					break;
				
				case "Copy":
					EditorCommands.CopyStateSelection();
					break;
					
				case "Paste":
					EditorCommands.PasteStates();
					break;
			}
    	}
		
		if (Event.current.type == EventType.ExecuteCommand)
		{
			
			//Debug.Log(Event.current.commandName);
			
			switch (Event.current.commandName)
			{
				case "OpenToolWindow":
					toolWindow = GetWindow<ContextToolWindow>();
					break;
				case "OpenFsmSelectorWindow":
					fsmSelectorWindow = GetWindow<FsmSelectorWindow>();
					fsmSelectorWindow.ShowUtility();
					break;
				case "OpenFsmTemplateWindow":
					fsmTemplateWindow = GetWindow<FsmTemplateWindow>();
					break;
				case "OpenStateSelectorWindow":
					stateSelectorWindow = GetWindow<FsmStateWindow>();
					break;
				case "OpenActionWindow":
					actionWindow = GetWindow<FsmActionWindow>();
					break;
				case "OpenErrorWindow":
					errorWindow = GetWindow<FsmErrorWindow>();
					break;
				case "OpenFsmLogWindow":
					logWindow = GetWindow<FsmLogWindow>();
					break;
				case "OpenAboutWindow":
					aboutWindow = GetWindow<AboutWindow>();
					break;
				case "AddFsmComponent":
					AddFsmToSelected();
					break;
				case "RepaintAll":
					RepaintAllWindows();
					break;
			}
	
			GUIUtility.ExitGUI();
		}
	
	}

	public void RepaintAllWindows()
	{
		if (toolWindow != null)
			toolWindow.Repaint();
		
		if (fsmSelectorWindow != null)
			fsmSelectorWindow.Repaint();
		
		if (stateSelectorWindow != null)
			stateSelectorWindow.Repaint();

		if (actionWindow != null)
			actionWindow.Repaint();
		
		if (errorWindow != null)
			errorWindow.Repaint();
	
		if (logWindow != null)
			logWindow.Repaint();

		Repaint();
	}

	public void Update()
	{
		fsmEditor.Update();
	}

	public void OnInspectorUpdate()
	{
		fsmEditor.OnInspectorUpdate();
	}

	public void OnFocus()
	{
		FsmEditorHelpers.BuildFsmList();
		fsmEditor.OnFocus();
	}

	public void OnSelectionChange()
	{
		fsmEditor.OnSelectionChange();
	}

	public void OnHierarchyChange()
	{
		FsmEditorHelpers.BuildFsmList();
		fsmEditor.OnHierarchyChange();
	}

	public void OnProjectChange()
	{
		fsmEditor.OnProjectChange();
	}

	public void OnDisable()
	{
		fsmEditor.OnDisable();
	}

	public void OnDestroy()
	{
		if (toolWindow != null)
			toolWindow.Close();
		
		if (fsmSelectorWindow != null)
			fsmSelectorWindow.Close();
		
		if (fsmTemplateWindow != null)
			fsmTemplateWindow.Close();

		if (stateSelectorWindow != null)
			stateSelectorWindow.Close();

		if (actionWindow != null)
			actionWindow.Close();

		if (errorWindow != null)
			errorWindow.Close();

		if (logWindow != null)
			logWindow.Close();

		if (aboutWindow != null)
			aboutWindow.Close();
	}

}

