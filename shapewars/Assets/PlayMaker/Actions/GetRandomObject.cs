// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.GameObject)]
	[Tooltip("Gets a Random Game Object from the scene.\nOptionally filter by Tag.")]
	public class GetRandomObject : FsmStateAction
	{
		[UIHint(UIHint.Tag)]
		public FsmString withTag;
		[RequiredField]
		[UIHint(UIHint.Variable)]
		public FsmGameObject storeResult;

		public override void Reset()
		{
			withTag = "Untagged";
			storeResult = null;
		}

		public override void OnEnter()
		{
			Finish();

			GameObject[] gameObjects;
			
			if (withTag.Value != "Untagged")
			{
				gameObjects = GameObject.FindGameObjectsWithTag(withTag.Value);
			}
			else 
			{
				gameObjects = (GameObject[])GameObject.FindSceneObjectsOfType(typeof(GameObject));
			}
				
			if (gameObjects.Length > 0)
			{
				storeResult.Value = gameObjects[Random.Range(0, gameObjects.Length)];
				return;
			}
	
			storeResult.Value = null;
		}
	}
}