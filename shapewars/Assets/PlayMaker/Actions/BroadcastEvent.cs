// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;
using System.Collections.Generic;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.StateMachine)]
	[Tooltip("Sends an Event to all FSMs in the scene or to all FSMs on a Game Object.\nNOTE: This action won't work on the very first frame of the game...")]
	public class BroadcastEvent : FsmStateAction
	{
		[RequiredField]
		public FsmString broadcastEvent;
		[Tooltip("Optionally specify a game object to broadcast the event to all FSMs on that game object.")]
		public FsmGameObject gameObject;
		[Tooltip("Broadcast to all FSMs on the game object's children.")]
		public FsmBool sendToChildren;
		public FsmBool excludeSelf;

		public override void Reset()
		{
			broadcastEvent = null;
			gameObject = null;
			sendToChildren = false;
			excludeSelf = false;
		}

		public override void OnEnter()
		{
			if (!string.IsNullOrEmpty(broadcastEvent.Value))
			{
				if (gameObject.Value != null)
				{
					BroadcastToGameObject(gameObject.Value);
				}
				else
				{
					BroadcastToAll();
				}
			}
			
			Finish();
		}
		
		void BroadcastToAll()
		{
			// copy the list in case broadcast event changes Fsm.FsmList
			
			var fsmList = new List<Fsm>(Fsm.FsmList);
			
			//Debug.Log("BroadcastToAll");
			foreach (var fsm in fsmList)
			{
				if (excludeSelf.Value && fsm == Fsm)
				{
					continue;
				}
				
				//Debug.Log("to: " + fsm.Name);
				fsm.Event(broadcastEvent.Value);
			}
		}
		
		void BroadcastToGameObject(GameObject go)
		{
			if (go == null) return;
			
			var fsmComponents = go.GetComponents<PlayMakerFSM>();
			
			foreach (var fsmComponent in fsmComponents)
			{
				fsmComponent.Fsm.Event(broadcastEvent.Value);
			}
			
			if (sendToChildren.Value)
			{
				for (int i = 0; i < go.transform.childCount; i++) 
				{
					BroadcastToGameObject(go.transform.GetChild(i).gameObject);	
				}
			}
		}
	}
}