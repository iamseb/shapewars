// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory("iTween")]
	[Tooltip("Stop an iTween action.")]
	public class iTweenStop : FsmStateAction
	{
		[RequiredField]
		public FsmOwnerDefault gameObject;
		public iTweenFSMType iTweenType = iTweenFSMType.all;
		public bool includeChildren = false;
		public bool inScene = false;
		
		public override void Reset()
		{
			iTweenType = iTweenFSMType.all;
			includeChildren = false;
			inScene = false;
		}

		public override void OnEnter()
		{
			base.OnEnter();
			DoiTween();
			Finish();
		}
							
		void DoiTween()
		{
			if(iTweenType == iTweenFSMType.all){
				iTween.Stop();
			} else {
				if(inScene) {
					iTween.Stop(System.Enum.GetName(typeof(iTweenFSMType), iTweenType));
				} else {
					GameObject go = Fsm.GetOwnerDefaultTarget(gameObject);
					if (go == null) return;
					iTween.Stop(go, System.Enum.GetName(typeof(iTweenFSMType), iTweenType), includeChildren);
				}
			}
		}
	}
}