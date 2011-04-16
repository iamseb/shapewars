// (c) copyright Hutong Games, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.GameObject)]
	[Tooltip("Activates/deactivates a Game Object.\nUse this to hide/show areas, or enable/disable many Behaviours at once.")]
	public class ActivateGameObject : FsmStateAction
	{
		[RequiredField]
		public FsmOwnerDefault gameObject;
		[Tooltip("Check to activate, uncheck to deactivate Game Object.")]
		[RequiredField]
		public FsmBool activate;
		[Tooltip("Recursively activate/deactivate all children.")]
		public FsmBool recursive;
		[Tooltip("Reset the game objects when exiting this state. Useful if you want an object to be active only while this state is active.")]
		public bool resetOnExit;
		
		// store the game object that we activated on enter
		// so we can de-activate it on exit.
		GameObject activatedGameObject;

		public override void Reset()
		{
			gameObject = null;
			activate = true;
			recursive = true;
			resetOnExit = false;
		}

		public override void OnEnter()
		{
			DoActivateGameObject();
			
			Finish();
		}

		public override void OnExit()
		{
			// the stored game object might be invalid now
			if (activatedGameObject == null) return;

			if (resetOnExit)
			{
				if (recursive.Value)
					activatedGameObject.SetActiveRecursively(!activate.Value);
				else
					activatedGameObject.active = !activate.Value;
			}
		}

		void DoActivateGameObject()
		{
			GameObject go = Fsm.GetOwnerDefaultTarget(gameObject);
			if (go == null) return;
			
			if (recursive.Value)
				go.SetActiveRecursively(activate.Value);
			else
				go.active = activate.Value;

			activatedGameObject = go;
		}
	}
}