// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using HutongGames.PlayMaker;
using UnityEngine;

public class FsmEditorHelpers
{
	public static void BuildFsmList()
	{
		// Have to collect these components here, because the classes in the dll can't see them
		// Maybe another way to do this? Inside the dll would be nice...

		//Debug.Log("BuildFsmList");

		Fsm.FsmList.Clear();
		var fsmComponents = (PlayMakerFSM[])(Resources.FindObjectsOfTypeAll(typeof(PlayMakerFSM)));
		foreach (var component in fsmComponents)
			component.AddToFsmList();
	}
}
