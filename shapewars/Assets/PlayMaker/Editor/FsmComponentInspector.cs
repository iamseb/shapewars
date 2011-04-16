// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEditor;
using UnityEngine;
using HutongGames.PlayMaker;
using HutongGames.PlayMaker.Actions;
using HutongGames.PlayMakerEditor;
using System.Collections.Generic;

// Basic inspector for FsmComponent.

[CustomEditor(typeof(PlayMakerFSM))]
public class FsmComponentInspector : Editor
{
	public static FsmComponentInspector fsmComponentInspector;
	
	const float indent = 20;
	
	PlayMakerFSM fsmComponent;
	
	public bool showInfo;
	public bool showStates;
	public bool showEvents;
	public bool showVariables;
	
	
	List<FsmVariable> fsmVariables = new List<FsmVariable>();
	
	GUIStyle textAreaStyle;
	
	void OnEnable()
	{
		fsmComponent = (PlayMakerFSM)target;
		BuildFsmVariableList();
		fsmComponentInspector = this;
	}

	public override void OnInspectorGUI()
	{	
		if (textAreaStyle == null)
		{
			textAreaStyle = new GUIStyle(EditorStyles.textField);
			textAreaStyle.wordWrap = true;
		}
		
		EditorGUILayout.BeginHorizontal();

		fsmComponent.FsmName = EditorGUILayout.TextField(fsmComponent.FsmName);

		if (GUILayout.Button(new GUIContent("Edit","Edit in the PlayMaker FSM Editor"), GUILayout.MaxWidth(50)))
		{
			FsmEditorWindow.OpenWindow();
			GUIUtility.ExitGUI();
		}
		
		showInfo = GUILayout.Toggle(showInfo, new GUIContent("Info","Show overview of States, Events and Variables"), "Button", GUILayout.MaxWidth(50));
		
		EditorGUILayout.EndHorizontal();
		
		fsmComponent.FsmDescription = EditorGUILayout.TextArea(fsmComponent.FsmDescription, textAreaStyle);

		//if (GUILayout.Button("Update Control Panel"))
		//	BuildFsmVariableList();
		
		// VARIABLES
		
		BuildFsmVariableList();
		
		//GUILayout.Label("Variables");
		
		foreach (var fsmVar in fsmVariables)
		{
			if (fsmVar.ShowInInspector)
				fsmVar.DoValueGUI(new GUIContent(fsmVar.Name, fsmVar.Tooltip));
		}
		
		if (GUI.changed)
		{
			FsmEditor.RepaintAll();
		}
		
		//INFO
		
		if (showInfo)
		{
			//GUILayout.Label("Description");
			//fsmComponent.FsmDescription = EditorGUILayout.TextArea(fsmComponent.FsmDescription);
			
			GUILayout.Label("Summary");
		
			showStates = EditorGUILayout.Foldout(showStates, "States [" + fsmComponent.FsmStates.Length + "]");
			if (showStates)
			{
				string states = "";
				
				if (fsmComponent.FsmStates.Length > 0)
				{
					foreach (var state in fsmComponent.FsmStates)
						states += "\t\t" + state.Name + "\n";
					states = states.Substring(0,states.Length-1);
				}
				else
				{
					states = "\t\t[none]";
				}
				
				GUILayout.Label(states);
			}
			
			showEvents = EditorGUILayout.Foldout(showEvents, "Events [" + fsmComponent.FsmEvents.Length + "]");
			if (showEvents) 
			{
				string events = "";
				
				if (fsmComponent.FsmEvents.Length > 0)
				{
					foreach (var fsmEvent in fsmComponent.FsmEvents)
						events += "\t\t" + fsmEvent.Name + "\n";
					events = events.Substring(0,events.Length-1);
				}
				else
				{
					events = "\t\t[none]";
				}
				
				GUILayout.Label(events);
			}
			
			showVariables = EditorGUILayout.Foldout(showVariables, "Variables [" + fsmVariables.Count + "]");
			if (showVariables)
			{
				string variables = "";
				
				if (fsmVariables.Count > 0)
				{
					foreach (var fsmVar in fsmVariables)
						variables += "\t\t" + fsmVar.Name + "\n";
					variables = variables.Substring(0,variables.Length-1);
				}
				else
				{
					variables = "\t\t[none]";
				}
				
				GUILayout.Label(variables);
			}
		}
	}
	
	void BuildFsmVariableList()
	{
		fsmVariables.Clear();

		foreach (var fsmFloat in fsmComponent.FsmVariables.FloatVariables)
			fsmVariables.Add(new FsmVariable(fsmFloat));
		foreach (var fsmInt in fsmComponent.FsmVariables.IntVariables)
			fsmVariables.Add(new FsmVariable(fsmInt));
		foreach (var fsmBool in fsmComponent.FsmVariables.BoolVariables)
			fsmVariables.Add(new FsmVariable(fsmBool));
		foreach (var fsmGameObject in fsmComponent.FsmVariables.GameObjectVariables)
			fsmVariables.Add(new FsmVariable(fsmGameObject));
		foreach (var fsmString in fsmComponent.FsmVariables.StringVariables)
			fsmVariables.Add(new FsmVariable(fsmString));
		foreach (var fsmColor in fsmComponent.FsmVariables.ColorVariables)
			fsmVariables.Add(new FsmVariable(fsmColor));
		foreach (var fsmVector3 in fsmComponent.FsmVariables.Vector3Variables)
			fsmVariables.Add(new FsmVariable(fsmVector3));

		fsmVariables.Sort();
	}
	
	iTweenMoveTo temp;
	Vector3[] tempVct3;
	FsmState lastSelectedState;
	
	public void OnSceneGUI(){
		if(fsmComponent.Fsm.EditState != null){
			for(int k = 0; k<fsmComponent.Fsm.EditState.Actions.Length;k++){
				if(fsmComponent.Fsm.EditState.Actions[k] is iTweenMoveTo){
					temp = (iTweenMoveTo)fsmComponent.Fsm.EditState.Actions[k];
					if(temp.transforms.Length >= 2) {
							Undo.SetSnapshotTarget(fsmComponent.gameObject,"Adjust iTween Path");
							tempVct3 = new Vector3[temp.transforms.Length];
							for(int i = 0;i<temp.transforms.Length;i++){
								if(temp.transforms[i].IsNone) tempVct3[i] = temp.vectors[i].IsNone ? Vector3.zero : temp.vectors[i].Value; 
								else {
									if(temp.transforms[i].Value == null) tempVct3[i] = temp.vectors[i].IsNone ? Vector3.zero : temp.vectors[i].Value; 
									else tempVct3[i] = temp.transforms[i].Value.transform.position + (temp.vectors[i].IsNone ? Vector3.zero : temp.vectors[i].Value);
								}
								tempVct3[i] = Handles.PositionHandle(tempVct3[i], Quaternion.identity);
								if(temp.transforms[i].IsNone) { 
									if(!temp.vectors[i].IsNone) temp.vectors[i].Value = tempVct3[i];
								}
								else {
									if(temp.transforms[i].Value == null) {
										if(!temp.vectors[i].IsNone) temp.vectors[i].Value = tempVct3[i];
									}
									else {
										if(!temp.vectors[i].IsNone){
											temp.vectors[i] = tempVct3[i] - temp.transforms[i].Value.transform.position;
										} 
									}
								}
							}
							Handles.Label(tempVct3[0], "'" + fsmComponent.name + "' Begin");
							Handles.Label(tempVct3[tempVct3.Length-1], "'" + fsmComponent.name + "' End");
							if(GUI.changed) FsmEditor.EditingActions();
					} 
				}
			}	
		}
	}
}


